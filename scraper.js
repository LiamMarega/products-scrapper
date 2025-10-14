// scraper.js - WooCommerce Product Scraper for Node 18+ & Puppeteer ^21
// Usage: node scraper.js --startUrl="https://example.com/category/" [options]
// Dependencies: puppeteer exceljs minimist

import fs from 'fs';
import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';
import minimist from 'minimist';

// ============================================================================
// CLI ARGUMENT PARSING
// ============================================================================
const argv = minimist(process.argv.slice(2));

if (argv.help || argv.h || !argv.startUrl) {
  console.log(`
🛒 WooCommerce Product Scraper
================================

Usage:
  node scraper.js --startUrl="<URL>" [options]

Required:
  --startUrl=<URL>           Category URL to scrape

Options:
  --maxPages=<N>             Maximum pages to scrape (default: all)
  --delayMs=<N>              Base delay between requests in ms (default: 400)
  --out=<file>               Output XLSX file (default: scrape.xlsx)
  --jsonOut=<file>           Optional JSON output for debugging
  --headless=<true|false>    Run in headless mode (default: true)
  --concurrency=<N>          Product scraping concurrency (default: 2)
  --help, -h                 Show this help

Example:
  node scraper.js --startUrl="https://todaysfurniture305.com/product-category/living-room/" --out=living-room.xlsx
`);
  process.exit(argv.help || argv.h ? 0 : 1);
}

const CONFIG = {
  startUrl: argv.startUrl,
  maxPages: parseInt(argv.maxPages) || Infinity,
  delayMs: parseInt(argv.delayMs) || 400,
  outFile: argv.out || 'scrape.xlsx',
  jsonOut: argv.jsonOut || null,
  headless: argv.headless === 'false' ? false : 'new',
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


// ============================================================================
// BROWSER SETUP
// ============================================================================

async function launchBrowser() {
  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  
  // Anti-detection measures
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  await page.setViewport({ width: 1366, height: 768 });
  page.setDefaultTimeout(CONFIG.timeout);
  page.setDefaultNavigationTimeout(CONFIG.timeout);

  // Block unnecessary resources
  await page.setRequestInterception(true);
  page.on('request', req => {
    const type = req.resourceType();
    if (['font', 'media', 'stylesheet'].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  return { browser, page };
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
    // Try to find pagination links
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

    // Scroll to load lazy content
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 2);
    });
    await sleep(300);

    const links = await page.$$eval('article.product', articles => {
      const urls = [];
      for (const article of articles) {
        // Try multiple selectors for product link
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

    // Extract all data in one evaluate call for efficiency
    const data = await page.evaluate(() => {
      const result = {
        title: null,
        description_html: null,
        description_text: null,
        short_description_html: null,
        short_description_text: null,
        categories: [],
        price: null,
        price_hidden_requires_login: false,
        discount_label: null,
        dimensions_raw: null,
        product_url: window.location.href,
        product_id: null,
        product_type: null,
        slug: null,
        sku: null,
        images: [],
        thumbnail: null,
        tags_extra: [],
        countdown: null,
        variants: null
      };

      // Title
      const titleEl = document.querySelector('h1.product_title, h1.product-title, h1');
      result.title = titleEl ? titleEl.innerText.trim() : null;

      // Product ID and Type from article classes
      const article = document.querySelector('article[class*="post-"], #product-24175, [class*="product-type-"]');
      if (article) {
        const classes = article.className;
        const idMatch = classes.match(/post-(\d+)/);
        const typeMatch = classes.match(/product-type-(\w+)/);
        result.product_id = idMatch ? idMatch[1] : null;
        result.product_type = typeMatch ? typeMatch[1] : null;
      }

      // ========== SLUG desde URL ==========
      const urlObj = new URL(window.location.href);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      const productIdx = pathParts.indexOf('product');
      const slug = productIdx >= 0 ? pathParts[productIdx + 1] : pathParts[pathParts.length - 1];
      result.slug = slug || null;

      // ========== SKU visible ==========
      const skuEl = document.querySelector('.sku, [itemprop="sku"], .product_meta .sku_wrapper .sku');
      result.sku = skuEl ? skuEl.textContent.trim() : null;

      // ========== Short Description (Woo estándar) ==========
      const shortDescEl = document.querySelector('.woocommerce-product-details__short-description');
      if (shortDescEl) {
        result.short_description_html = shortDescEl.innerHTML.trim();
        result.short_description_text = shortDescEl.innerText.trim();
      }

      // Check for hidden price (login required)
      const hiddenPriceBlock = document.querySelector('.ced_hpul_single_summary_wrapper, .ced_hpul_login_link');
      const bodyText = document.body.innerText.toLowerCase();
      if (hiddenPriceBlock || (bodyText.includes('please') && bodyText.includes('register') && bodyText.includes('price'))) {
        result.price_hidden_requires_login = true;
        result.price = null;
      } else {
        // Try to get visible price
        const priceEl = document.querySelector('.summary .price, p.price, .woocommerce-Price-amount');
        result.price = priceEl ? priceEl.innerText.trim() : null;
      }

      // Discount label
      const discountEl = document.querySelector('.product-label.discount, .onsale');
      result.discount_label = discountEl ? discountEl.innerText.trim() : null;

      // Categories
      const categoryLinks = document.querySelectorAll('.product_meta .posted_in a, .breadcrumb a[rel="tag"]');
      result.categories = Array.from(categoryLinks).map(a => a.innerText.trim()).filter(Boolean);

      // Tags (additional)
      const tagLinks = document.querySelectorAll('.tagged_as a, .product-tags a');
      result.tags_extra = Array.from(tagLinks).map(a => a.innerText.trim()).filter(Boolean);

      // Description (from tab)
      const descTab = document.querySelector('#tab-description, .woocommerce-Tabs-panel--description, #tab-description-content');
      if (descTab) {
        result.description_html = descTab.innerHTML.trim();
        result.description_text = descTab.innerText.trim();
      }

      // Extract dimensions from description
      if (result.description_text) {
        const dimMatch = result.description_text.match(/(\d+["']?\s*[xX×]\s*\d+["']?\s*[xX×]\s*\d+["']?)/);
        result.dimensions_raw = dimMatch ? dimMatch[1].trim() : null;
      }

      // Images from gallery
      const galleryImages = document.querySelectorAll('.woocommerce-product-gallery__image');
      const seen = new Set();
      
      for (const slide of galleryImages) {
        // Priority 1: Link href (usually high-res)
        const link = slide.querySelector('a[href]');
        if (link && link.href && !link.href.includes('javascript:')) {
          const abs = new URL(link.href, window.location.href).href;
          if (!seen.has(abs)) {
            seen.add(abs);
            result.images.push(abs);
          }
          continue;
        }

        // Priority 2: img data-large_image
        const img = slide.querySelector('img');
        if (img) {
          const largeImage = img.getAttribute('data-large_image');
          if (largeImage) {
            const abs = new URL(largeImage, window.location.href).href;
            if (!seen.has(abs)) {
              seen.add(abs);
              result.images.push(abs);
            }
            continue;
          }

          // Priority 3: data-lazy-src or data-src
          const lazySrc = img.getAttribute('data-lazy-src') || img.getAttribute('data-src');
          if (lazySrc) {
            const abs = new URL(lazySrc, window.location.href).href;
            if (!seen.has(abs)) {
              seen.add(abs);
              result.images.push(abs);
            }
            continue;
          }

          // Priority 4: srcset (pick largest)
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
                result.images.push(abs);
              }
              continue;
            }
          }

          // Priority 5: regular src
          if (img.src && !img.src.includes('data:')) {
            const abs = new URL(img.src, window.location.href).href;
            if (!seen.has(abs)) {
              seen.add(abs);
              result.images.push(abs);
            }
          }
        }
      }

      // Thumbnail = first image
      result.thumbnail = result.images[0] || null;

      // Countdown data
      const countdownEl = document.querySelector('.product-countdown[data-y], [data-countdown]');
      if (countdownEl) {
        result.countdown = {
          year: countdownEl.getAttribute('data-y') || null,
          month: countdownEl.getAttribute('data-m') || null,
          day: countdownEl.getAttribute('data-d') || null,
          hour: countdownEl.getAttribute('data-h') || null,
          minute: countdownEl.getAttribute('data-i') || null,
          second: countdownEl.getAttribute('data-s') || null
        };
      }

      // ========== Variantes (productos variables de WooCommerce) ==========
      const varForm = document.querySelector('form.variations_form');
      if (varForm && varForm.getAttribute('data-product_variations')) {
        try {
          const rawVariants = JSON.parse(varForm.getAttribute('data-product_variations'));
          result.variants = rawVariants.map(v => ({
            variation_id: v.variation_id,
            sku: v.sku || null,
            price_html: v.price_html || null,
            display_price: v.display_price || null,
            attributes: v.attributes || {}, // ej: { attribute_pa_color: "black" }
            image: v.image?.url || v.image?.src || null,
            is_in_stock: v.is_in_stock ?? true,
            stock_quantity: v.max_qty || null
          }));
        } catch (e) {
          // Error parseando variantes, dejar null
        }
      }

      return result;
    });

    console.log(`   ✅ ${data.title || 'Untitled'}`);
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
// EXCEL EXPORT
// ============================================================================

async function toXlsx(rows, outPath) {
  console.log(`💾 Writing ${rows.length} products to ${outPath}...`);
  
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('products');

  ws.columns = [
    { header: 'title', key: 'title', width: 40 },
    { header: 'slug', key: 'slug', width: 30 },
    { header: 'sku', key: 'sku', width: 20 },
    { header: 'description_text', key: 'description_text', width: 60 },
    { header: 'description_html', key: 'description_html', width: 60 },
    { header: 'short_description_text', key: 'short_description_text', width: 50 },
    { header: 'short_description_html', key: 'short_description_html', width: 60 },
    { header: 'categories', key: 'categories', width: 40 },
    { header: 'tags_extra', key: 'tags_extra', width: 30 },
    { header: 'price', key: 'price', width: 12 },
    { header: 'price_hidden_requires_login', key: 'price_hidden_requires_login', width: 10 },
    { header: 'discount_label', key: 'discount_label', width: 10 },
    { header: 'dimensions_raw', key: 'dimensions_raw', width: 20 },
    { header: 'product_type', key: 'product_type', width: 20 },
    { header: 'product_id', key: 'product_id', width: 12 },
    { header: 'product_url', key: 'product_url', width: 60 },
    { header: 'thumbnail', key: 'thumbnail', width: 60 },
    { header: 'images', key: 'images', width: 80 },
    { header: 'variants_json', key: 'variants_json', width: 80 },
    { header: 'countdown', key: 'countdown', width: 40 }
  ];

  for (const r of rows) {
    ws.addRow({
      title: r.title || '',
      slug: r.slug || '',
      sku: r.sku || '',
      description_text: r.description_text || '',
      description_html: r.description_html || '',
      short_description_text: r.short_description_text || '',
      short_description_html: r.short_description_html || '',
      categories: (r.categories || []).join('|'),
      tags_extra: (r.tags_extra || []).join('|'),
      price: r.price || '',
      price_hidden_requires_login: r.price_hidden_requires_login ? 'TRUE' : 'FALSE',
      discount_label: r.discount_label || '',
      dimensions_raw: r.dimensions_raw || '',
      product_type: r.product_type || '',
      product_id: r.product_id || '',
      product_url: r.product_url || '',
      thumbnail: r.thumbnail || '',
      images: (r.images || []).join('|'),
      variants_json: r.variants ? JSON.stringify(r.variants) : '',
      countdown: r.countdown ? JSON.stringify(r.countdown) : ''
    });
  }

  await wb.xlsx.writeFile(outPath);
  console.log(`   ✅ Saved successfully`);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const startTime = Date.now();
  let browser;

  try {
    // Launch browser
    const setup = await launchBrowser();
    browser = setup.browser;
    const page = setup.page;

    // Step 1: Collect all category pages
    const categoryPages = await collectCategoryPages(page, CONFIG.startUrl, CONFIG.maxPages);
    
    // Step 2: Collect all product links from all category pages
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

    // Step 4: Export to XLSX
    if (results.length > 0) {
      await toXlsx(results, CONFIG.outFile);
      
      // Optional JSON export
      if (CONFIG.jsonOut) {
        fs.writeFileSync(CONFIG.jsonOut, JSON.stringify(results, null, 2));
        console.log(`💾 JSON saved to ${CONFIG.jsonOut}`);
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 Done in ${elapsed}s`);

  } catch (e) {
    console.error('💥 Fatal error:', e);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

// Run
main().catch(console.error);