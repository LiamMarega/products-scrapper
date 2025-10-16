// scraper-vendure.js - WooCommerce to Vendure CSV Scraper
// Usage: node scraper-vendure.js --startUrl="https://example.com/category/" [options]
// Dependencies: puppeteer papaparse minimist

import fs from 'fs';
import puppeteer from 'puppeteer';
import Papa from 'papaparse';
import minimist from 'minimist';

// ============================================================================
// CLI ARGUMENT PARSING
// ============================================================================
const argv = minimist(process.argv.slice(2));

if (argv.help || argv.h || !argv.startUrl) {
  console.log(`
🛒 WooCommerce to Vendure CSV Scraper
======================================

Usage:
  node scraper-vendure.js --startUrl="<URL>" [options]

Required:
  --startUrl=<URL>           Category URL to scrape

Options:
  --maxPages=<N>             Maximum pages to scrape (default: all)
  --delayMs=<N>              Base delay between requests in ms (default: 400)
  --out=<file>               Output CSV file (default: vendure-import.csv)
  --headless=<true|false>    Run in headless mode (default: false)
  --concurrency=<N>          Product scraping concurrency (default: 2)
  --help, -h                 Show this help

Example:
  node scraper.js --startUrl="https://todaysfurniture305.com/product-category/living-room/" --out=living-room.csv
`);
  process.exit(argv.help || argv.h ? 0 : 1);
}

const CONFIG = {
  startUrl: argv.startUrl,
  maxPages: parseInt(argv.maxPages) || Infinity,
  delayMs: parseInt(argv.delayMs) || 400,
  outFile: argv.out || 'vendure-import.csv',
  headless: argv.headless === 'true' ? 'new' : false,
  concurrency: parseInt(argv.concurrency) || 2,
  timeout: 30000,
  retries: 2
};

// Validate URL
try {
  new URL(CONFIG.startUrl);
} catch (e) {
  console.error('❌ Error: Invalid startUrl format');
  process.exit(1);
}

console.log('🚀 Starting scraper with config:', CONFIG);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function randomDelay(base = CONFIG.delayMs) {
  const variance = base * 0.5;
  return base + Math.random() * variance;
}

async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

function uniq(arr) {
  return Array.from(new Set(arr.filter(Boolean)));
}

// Extract current price from WooCommerce format
function extractPrice(priceText) {
  if (!priceText) return '';
  
  let text = String(priceText).replace(/[$€£¥]/g, '').trim();
  
  // Check for "Current price is:" pattern
  const currentMatch = text.match(/Current price is:\s*([0-9,\.]+)/i);
  if (currentMatch) {
    return currentMatch[1].replace(/,/g, '');
  }
  
  // Check for multiple prices (sale scenario)
  const prices = text.match(/([0-9,\.]+)/g);
  if (prices && prices.length > 1) {
    return prices[prices.length - 1].replace(/,/g, '');
  }
  
  if (prices && prices.length === 1) {
    return prices[0].replace(/,/g, '');
  }
  
  return '';
}

function normalizeAttributeName(attrKey) {
  return String(attrKey)
    .replace(/^attribute_pa_/i, '')
    .replace(/^attribute_/i, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

// ============================================================================
// BROWSER SETUP
// ============================================================================

async function launchBrowser() {
  try {
    const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
    console.log('✓ Connected to existing Chrome instance');
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', req => {
      const type = req.resourceType();
      if (['font', 'media'].includes(type)) req.abort(); 
      else req.continue();
    });
    return { browser, page };
  } catch {
    console.log('→ Launching new Chrome instance...');
    const browser = await puppeteer.launch({
      headless: CONFIG.headless,
      channel: 'chrome',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--user-data-dir=${process.env.CHROME_DATA_DIR || './.chrome-profile'}`,
      ],
      defaultViewport: { width: 1366, height: 768 },
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', req => {
      const type = req.resourceType();
      if (['font', 'media'].includes(type)) req.abort(); 
      else req.continue();
    });
    return { browser, page };
  }
}

// ============================================================================
// PAGINATION LOGIC
// ============================================================================

async function collectCategoryPages(page, startUrl, maxPages) {
  console.log('📄 Collecting category pages...');
  
  await page.goto(startUrl, { waitUntil: 'domcontentloaded' });
  await sleep(randomDelay());

  const pages = [startUrl];
  
  try {
    const paginationLinks = await page.$$eval(
      'nav.woocommerce-pagination .page-numbers a.page-numbers:not(.next):not(.prev)',
      links => links.map(a => a.href).filter(Boolean)
    ).catch(() => []);

    const uniquePages = uniq([startUrl, ...paginationLinks]);
    const limited = uniquePages.slice(0, maxPages);
    
    console.log(`   Found ${uniquePages.length} pages, will scrape ${limited.length}`);
    return limited;
  } catch (e) {
    console.warn('   Could not find pagination, using single page only');
    return pages;
  }
}

// ============================================================================
// PRODUCT LINK COLLECTION
// ============================================================================

async function collectProductLinksFromCategory(page, categoryUrl) {
  console.log(`🔗 Collecting products from: ${categoryUrl}`);
  
  try {
    await page.goto(categoryUrl, { waitUntil: 'domcontentloaded' });
    await sleep(randomDelay());

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 2);
    });
    await sleep(300);

    const links = await page.$$eval('article.product', articles => {
      const urls = [];
      for (const article of articles) {
        const link = article.querySelector('figure a, .product-title a, a[href*="/product/"]');
        if (link && link.href && link.href.includes('/product/')) {
          urls.push(link.href);
        }
      }
      return urls;
    }).catch(() => []);

    console.log(`   Found ${links.length} products`);
    return uniq(links);
  } catch (e) {
    console.error(`   ❌ Error collecting links: ${e.message}`);
    return [];
  }
}

// ============================================================================
// PRODUCT SCRAPING
// ============================================================================

async function scrapeProduct(page, url, retryCount = 0) {
  try {
    console.log(`📦 Scraping: ${url}`);
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: CONFIG.timeout });
    await sleep(randomDelay());

    const data = await page.evaluate(() => {
      const result = {
        name: null,
        slug: null,
        description: null,
        assets: [],
        facets: [],
        categories: [],
        price: null,
        sku: null,
        variants: [],
        product_type: null
      };

      // Title
      const titleEl = document.querySelector('h1.product_title, h1.product-title, h1');
      result.name = titleEl ? titleEl.innerText.trim() : null;

      // Slug from URL
      const urlObj = new URL(window.location.href);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      const productIdx = pathParts.indexOf('product');
      result.slug = productIdx >= 0 ? pathParts[productIdx + 1] : pathParts[pathParts.length - 1];

      // SKU
      const skuEl = document.querySelector('.sku, [itemprop="sku"], .product_meta .sku_wrapper .sku');
      result.sku = skuEl ? skuEl.textContent.trim() : null;

      // Product Type
      const article = document.querySelector('article[class*="product-type-"]');
      if (article) {
        const typeMatch = article.className.match(/product-type-(\w+)/);
        result.product_type = typeMatch ? typeMatch[1] : 'simple';
      }

      // Description
      const descTab = document.querySelector('#tab-description, .woocommerce-Tabs-panel--description');
      if (descTab) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = descTab.innerHTML;
        result.description = tempDiv.textContent.trim().replace(/\s+/g, ' ');
      }

      // Short description
      const shortDescEl = document.querySelector('.woocommerce-product-details__short-description');
      if (shortDescEl) {
        const shortText = shortDescEl.innerText.trim().replace(/\s+/g, ' ');
        result.description = result.description 
          ? `${result.description} ${shortText}` 
          : shortText;
      }

      // Price
      const priceEl = document.querySelector('.summary .price, p.price');
      result.price = priceEl ? priceEl.innerText.trim() : null;

      // Categories
      const categoryLinks = document.querySelectorAll('.product_meta .posted_in a');
      result.categories = Array.from(categoryLinks)
        .map(a => a.innerText.trim())
        .filter(Boolean);

      // Images from gallery
      const galleryImages = document.querySelectorAll('.woocommerce-product-gallery__image');
      const seen = new Set();
      
      for (const slide of galleryImages) {
        const link = slide.querySelector('a[href]');
        if (link && link.href && !link.href.includes('javascript:')) {
          const abs = new URL(link.href, window.location.href).href;
          if (!seen.has(abs)) {
            seen.add(abs);
            result.assets.push(abs);
          }
          continue;
        }

        const img = slide.querySelector('img');
        if (img) {
          const largeImage = img.getAttribute('data-large_image');
          if (largeImage) {
            const abs = new URL(largeImage, window.location.href).href;
            if (!seen.has(abs)) {
              seen.add(abs);
              result.assets.push(abs);
            }
            continue;
          }

          const srcset = img.getAttribute('srcset');
          if (srcset) {
            const candidates = srcset.split(',').map(s => {
              const parts = s.trim().split(/\s+/);
              return { url: parts[0], width: parseInt(parts[1]?.replace('w', '') || '0', 10) };
            });
            candidates.sort((a, b) => b.width - a.width);
            if (candidates[0]) {
              const abs = new URL(candidates[0].url, window.location.href).href;
              if (!seen.has(abs)) {
                seen.add(abs);
                result.assets.push(abs);
              }
              continue;
            }
          }

          if (img.src && !img.src.includes('data:')) {
            const abs = new URL(img.src, window.location.href).href;
            if (!seen.has(abs)) {
              seen.add(abs);
              result.assets.push(abs);
            }
          }
        }
      }

      // Variants
      const varForm = document.querySelector('form.variations_form');
      if (varForm && varForm.getAttribute('data-product_variations')) {
        try {
          const rawVariants = JSON.parse(varForm.getAttribute('data-product_variations'));
          result.variants = rawVariants.map(v => ({
            sku: v.sku || null,
            price: v.display_price || null,
            attributes: v.attributes || {},
            image: v.image?.url || v.image?.src || null
          }));
        } catch (e) {
          // Error parsing variants
        }
      }

      return result;
    });

    console.log(`   ✅ ${data.name || 'Untitled'}`);
    return data;

  } catch (e) {
    if (retryCount < CONFIG.retries) {
      console.warn(`   ⚠️  Retry ${retryCount + 1}/${CONFIG.retries}: ${e.message}`);
      await sleep(randomDelay() * 2);
      return scrapeProduct(page, url, retryCount + 1);
    }
    console.error(`   ❌ Failed after ${CONFIG.retries} retries: ${e.message}`);
    return null;
  }
}

// ============================================================================
// CONCURRENT SCRAPING
// ============================================================================

async function scrapeProductsConcurrently(browser, productUrls) {
  const results = [];
  const queue = [...productUrls];
  const workers = [];

  for (let i = 0; i < CONFIG.concurrency; i++) {
    workers.push((async () => {
      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      await page.setViewport({ width: 1366, height: 768 });
      page.setDefaultTimeout(CONFIG.timeout);

      while (queue.length > 0) {
        const url = queue.shift();
        if (!url) break;
        
        const data = await scrapeProduct(page, url);
        if (data) results.push(data);
        
        await sleep(randomDelay());
      }

      await page.close();
    })());
  }

  await Promise.all(workers);
  return results;
}

// ============================================================================
// VENDURE CSV EXPORT
// ============================================================================

function productToVendureRows(product) {
  if (!product.name) return [];

  const rows = [];
  const categories = (product.categories || [])
    .map(cat => `category:${cat}`)
    .join('|');

  const assets = (product.assets || []).join('|');
  const description = (product.description || '').replace(/"/g, '""'); // Escape quotes

  // Check if product has variants
  if (product.variants && product.variants.length > 1) {
    // Variable product
    const optionGroupsSet = new Set();
    
    // Collect all unique attributes
    product.variants.forEach(variant => {
      Object.keys(variant.attributes || {}).forEach(attrKey => {
        optionGroupsSet.add(normalizeAttributeName(attrKey));
      });
    });
    
    const optionGroups = Array.from(optionGroupsSet).join('|');

    // First row: product data + first variant
    const firstVariant = product.variants[0];
    const optionValues = Array.from(optionGroupsSet).map(group => {
      const attrKey = Object.keys(firstVariant.attributes || {})
        .find(k => normalizeAttributeName(k) === group);
      return attrKey ? firstVariant.attributes[attrKey] : '';
    }).join('|');

    const price = extractPrice(firstVariant.price || product.price);

    rows.push({
      name: product.name,
      slug: product.slug || '',
      description: description,
      assets: assets,
      facets: categories,
      optionGroups: optionGroups,
      optionValues: optionValues,
      sku: firstVariant.sku || product.sku || '',
      price: price,
      taxCategory: 'standard',
      stockOnHand: '100',
      trackInventory: 'false',
      variantAssets: firstVariant.image || '',
      variantFacets: ''
    });

    // Subsequent rows: additional variants (empty product fields)
    for (let i = 1; i < product.variants.length; i++) {
      const variant = product.variants[i];
      const optionValues = Array.from(optionGroupsSet).map(group => {
        const attrKey = Object.keys(variant.attributes || {})
          .find(k => normalizeAttributeName(k) === group);
        return attrKey ? variant.attributes[attrKey] : '';
      }).join('|');

      const variantPrice = extractPrice(variant.price || product.price);

      rows.push({
        name: '',
        slug: '',
        description: '',
        assets: '',
        facets: '',
        optionGroups: '',
        optionValues: optionValues,
        sku: variant.sku || `${product.sku}-${i}`,
        price: variantPrice,
        taxCategory: 'standard',
        stockOnHand: '100',
        trackInventory: 'false',
        variantAssets: variant.image || '',
        variantFacets: ''
      });
    }
  } else {
    // Simple product (single variant)
    const price = extractPrice(product.price);

    rows.push({
      name: product.name,
      slug: product.slug || '',
      description: description,
      assets: assets,
      facets: categories,
      optionGroups: '',
      optionValues: '',
      sku: product.sku || '',
      price: price,
      taxCategory: 'standard',
      stockOnHand: '100',
      trackInventory: 'false',
      variantAssets: '',
      variantFacets: ''
    });
  }

  return rows;
}

function toVendureCSV(products, outPath) {
  console.log(`💾 Writing ${products.length} products to Vendure CSV: ${outPath}...`);
  
  const allRows = [];
  
  for (const product of products) {
    const rows = productToVendureRows(product);
    allRows.push(...rows);
  }

  // Use papaparse to generate proper CSV
  const csv = Papa.unparse(allRows, {
    quotes: true, // Quote all fields
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ',',
    header: true,
    newline: '\n',
    columns: [
      'name',
      'slug',
      'description',
      'assets',
      'facets',
      'optionGroups',
      'optionValues',
      'sku',
      'price',
      'taxCategory',
      'stockOnHand',
      'trackInventory',
      'variantAssets',
      'variantFacets'
    ]
  });

  fs.writeFileSync(outPath, csv, 'utf-8');
  console.log(`   ✅ Saved ${allRows.length} rows successfully`);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const startTime = Date.now();
  let browser;

  try {
    const setup = await launchBrowser();
    browser = setup.browser;
    const page = setup.page;

    // Step 1: Collect all category pages
    const categoryPages = await collectCategoryPages(page, CONFIG.startUrl, CONFIG.maxPages);
    
    // Step 2: Collect all product links
    let allProductUrls = [];
    for (const catPage of categoryPages) {
      const links = await collectProductLinksFromCategory(page, catPage);
      allProductUrls = allProductUrls.concat(links);
      await sleep(randomDelay());
    }
    
    allProductUrls = uniq(allProductUrls);
    console.log(`\n📊 Total unique products found: ${allProductUrls.length}\n`);

    if (allProductUrls.length === 0) {
      console.warn('⚠️  No products found. Check selectors or URL.');
      await browser.close();
      return;
    }

    // Step 3: Scrape all products
    const results = await scrapeProductsConcurrently(browser, allProductUrls);
    
    console.log(`\n✅ Successfully scraped ${results.length} products\n`);

    // Step 4: Export to Vendure CSV
    if (results.length > 0) {
      toVendureCSV(results, CONFIG.outFile);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 Done in ${elapsed}s`);
    console.log(`\n📁 Import file created: ${CONFIG.outFile}`);
    console.log(`   Use this file with Vendure's populate() function`);

  } catch (e) {
    console.error('💥 Fatal error:', e);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

// Run
main().catch(console.error);