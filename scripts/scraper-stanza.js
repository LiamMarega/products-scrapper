// scraper-stanza-playwright-stealth.js - Undetectable Stanza Furniture scraper
// Install: npm install playwright playwright-stealth papaparse minimist
// Usage: node scraper-stanza-playwright-stealth.js --startUrl="https://stanzafurniture.com/product-category/living-room/"

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright'; 

import Papa from 'papaparse';
import minimist from 'minimist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.resolve(PROJECT_ROOT, 'output', 'stanza');

const argv = minimist(process.argv.slice(2));

if (argv.help || argv.h || !argv.startUrl) {
  console.log(`
🛒 Stanza Furniture Scraper - Stealth Version
==============================================

Usage:
  node scraper-stanza-playwright-stealth.js --startUrl="<URL>" [options]

Required:
  --startUrl=<URL>           Category URL to scrape

Options:
  --maxPages=<N>             Maximum pages to scrape (default: all)
  --delayMs=<N>              Base delay between requests (default: 8000)
  --out=<file>               Output CSV file
  --jsonOut=<file>           Output JSON file
  --headless=<true|false>    Run in headless mode (default: true)
  --stealth=<true|false>     Use stealth mode (default: true)
  --help, -h                 Show this help

Example:
  node scraper-stanza-playwright-stealth.js --startUrl="https://stanzafurniture.com/product-category/living-room/" --maxPages=2 --headless=true
`);
  process.exit(argv.help || argv.h ? 0 : 1);
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function resolveOutputPath(filePath) {
  if (!filePath) return path.resolve(OUTPUT_DIR, 'stanza-stealth.csv');
  if (path.isAbsolute(filePath)) return filePath;
  return path.resolve(OUTPUT_DIR, filePath);
}

const CONFIG = {
  startUrl: argv.startUrl,
  maxPages: parseInt(argv.maxPages) || Infinity,
  delayMs: parseInt(argv.delayMs) || 8000,
  outFile: resolveOutputPath(argv.out),
  jsonOut: argv.jsonOut ? resolveOutputPath(argv.jsonOut) : null,
  headless: argv.headless !== 'false',
  stealth: argv.stealth !== 'false',
  timeout: 90000
};

console.log('🚀 Starting Stealth Scraper:', CONFIG);

// Enhanced User Agent Pool
const userAgentPool = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'
];

function getRandomUserAgent() {
  return userAgentPool[Math.floor(Math.random() * userAgentPool.length)];
}

// Enhanced delay with human-like variance
function humanDelay(base = CONFIG.delayMs) {
  const jitter = base * 0.6; // 60% variance
  return base + (Math.random() * jitter - jitter/2);
}

async function sleep(ms) {
  console.log(`⏳ Waiting ${(ms/1000).toFixed(1)}s...`);
  await new Promise(resolve => setTimeout(resolve, ms));
}

function uniq(arr) {
  return Array.from(new Set(arr.filter(Boolean)));
}

function extractPrice(priceText) {
  if (!priceText) return '';
  let text = String(priceText).replace(/[$€£¥]/g, '').trim();
  const currentMatch = text.match(/Current price is:\s*([0-9,\.]+)/i);
  if (currentMatch) return currentMatch[1].replace(/,/g, '');
  const prices = text.match(/([0-9,\.]+)/g);
  if (prices && prices.length > 1) return prices[prices.length - 1].replace(/,/g, '');
  if (prices && prices.length === 1) return prices[0].replace(/,/g, '');
  return '';
}

// Enhanced human behavior simulation
async function simulateHumanBehavior(page) {
  console.log('👤 Simulating human behavior...');
  
  // Random mouse movements
  const moves = Math.floor(Math.random() * 4) + 2;
  for (let i = 0; i < moves; i++) {
    await page.mouse.move(
      Math.random() * 1200 + 100,
      Math.random() * 700 + 100,
      { steps: Math.random() * 10 + 5 }
    );
    await sleep(Math.random() * 300 + 100);
  }
  
  // Natural scrolling pattern
  const scrollCycles = Math.floor(Math.random() * 4) + 3;
  let currentPosition = 0;
  
  for (let i = 0; i < scrollCycles; i++) {
    const scrollDown = Math.random() * 600 + 200;
    currentPosition += scrollDown;
    
    await page.evaluate((pos) => {
      window.scrollTo(0, pos);
    }, currentPosition);
    
    await sleep(Math.random() * 800 + 400);
    
    // Occasionally scroll back up a bit (like a real user)
    if (Math.random() > 0.7 && i > 0) {
      const scrollUp = Math.random() * 200 + 50;
      currentPosition -= scrollUp;
      
      await page.evaluate((pos) => {
        window.scrollTo(0, pos);
      }, currentPosition);
      
      await sleep(Math.random() * 400 + 200);
    }
  }
  
  // Random clicks on non-interactive areas (20% chance)
  if (Math.random() > 0.8) {
    await page.mouse.click(
      Math.random() * 1000 + 200,
      Math.random() * 600 + 100,
      { 
        delay: Math.random() * 100 + 50,
        button: Math.random() > 0.8 ? 'right' : 'left'
      }
    );
    await sleep(Math.random() * 500 + 200);
  }
  
  // Scroll to top at the end
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
}

async function checkForBlock(page) {
  const content = await page.content();
  const title = await page.title().catch(() => '');
  const url = page.url();
  
  return content.includes('403') || 
         content.includes('Forbidden') || 
         content.includes('error--bg__cover') ||
         title.includes('Access Denied') ||
         url.includes('challenge') ||
         content.includes('bot') && content.includes('blocked');
}

async function collectCategoryPages(page, startUrl, maxPages) {
  console.log('📄 Collecting category pages...');
  
  try {
    await page.goto(startUrl, { 
      waitUntil: 'networkidle',
      timeout: CONFIG.timeout 
    });
    
    await sleep(humanDelay(3000));
    
    if (await checkForBlock(page)) {
      throw new Error('🚫 Blocked by anti-bot protection');
    }
    
    await simulateHumanBehavior(page);
    
    const paginationLinks = await page.$$eval(
      'nav.woocommerce-pagination .page-numbers a.page-numbers:not(.next):not(.prev)',
      links => links.map(a => a.href).filter(Boolean)
    ).catch(() => []);

    const uniquePages = uniq([startUrl, ...paginationLinks]);
    const limited = uniquePages.slice(0, maxPages);
    
    console.log(`   Found ${uniquePages.length} pages, will scrape ${limited.length}`);
    return limited;
  } catch (e) {
    console.error('   ❌ Error collecting category pages:', e.message);
    return [startUrl];
  }
}

async function collectProductLinks(page, categoryUrl) {
  console.log(`🔗 Collecting products from: ${categoryUrl}`);
  
  try {
    await page.goto(categoryUrl, { 
      waitUntil: 'networkidle',
      timeout: CONFIG.timeout 
    });
    
    await sleep(humanDelay(2000));
    
    if (await checkForBlock(page)) {
      throw new Error('🚫 Blocked by anti-bot');
    }
    
    await simulateHumanBehavior(page);
    
    const links = await page.$$eval('li.product', products => {
      const urls = [];
      for (const product of products) {
        const link = product.querySelector('a.woocommerce-LoopProduct-link');
        if (link?.href?.includes('/product/')) {
          urls.push(link.href);
        }
      }
      return urls;
    }).catch(() => []);

    console.log(`   Found ${links.length} products`);
    return uniq(links);
  } catch (e) {
    console.error(`   ❌ Error collecting products: ${e.message}`);
    return [];
  }
}

async function scrapeProduct(page, url) {
  try {
    console.log(`📦 Scraping: ${url}`);
    
    await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: CONFIG.timeout 
    });
    
    await sleep(humanDelay(4000));
    
    if (await checkForBlock(page)) {
      throw new Error('🚫 Blocked by anti-bot');
    }
    
    await simulateHumanBehavior(page);
    
    // Additional wait for dynamic content
    await sleep(humanDelay(2000));

    const data = await page.evaluate(() => {
      const result = {
        name: null,
        slug: null,
        description: null,
        assets: [],
        categories: [],
        price: null,
        sku: null,
        stock: null,
        scraped_at: new Date().toISOString()
      };

      // Multiple selectors for robustness
      const titleSelectors = [
        'h1.product_title.entry-title',
        'h1.product-title',
        '.product_title',
        'h1.entry-title'
      ];
      
      for (const selector of titleSelectors) {
        const el = document.querySelector(selector);
        if (el?.textContent?.trim()) {
          result.name = el.textContent.trim();
          break;
        }
      }

      // Extract slug from URL
      const urlObj = new URL(window.location.href);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      const productIdx = pathParts.indexOf('product');
      result.slug = productIdx >= 0 ? pathParts[productIdx + 1] : pathParts[pathParts.length - 1];

      // SKU with multiple selectors
      const skuSelectors = [
        '.sku_wrapper .sku',
        '.product_meta .sku',
        '.sku',
        '[itemprop="sku"]'
      ];
      
      for (const selector of skuSelectors) {
        const el = document.querySelector(selector);
        if (el?.textContent?.trim()) {
          result.sku = el.textContent.trim();
          break;
        }
      }

      // Stock status
      const stockSelectors = [
        'p.stock',
        '.stock',
        '.availability',
        '.product-stock'
      ];
      
      for (const selector of stockSelectors) {
        const el = document.querySelector(selector);
        if (el?.textContent?.trim()) {
          result.stock = el.textContent.trim();
          break;
        }
      }

      // Price with multiple selectors
      const priceSelectors = [
        '.summary .price',
        '.product-price',
        '.price',
        '[itemprop="price"]',
        '.woocommerce-Price-amount'
      ];
      
      for (const selector of priceSelectors) {
        const el = document.querySelector(selector);
        if (el?.textContent?.trim()) {
          result.price = el.textContent.trim();
          break;
        }
      }

      // Categories
      const categorySelectors = [
        '.product_meta .posted_in a',
        '.product-category a',
        '.categories a',
        '[rel="tag"]'
      ];
      
      for (const selector of categorySelectors) {
        const categoryLinks = document.querySelectorAll(selector);
        if (categoryLinks.length > 0) {
          result.categories = Array.from(categoryLinks)
            .map(a => a.textContent.trim())
            .filter(Boolean);
          break;
        }
      }

      // Description - try multiple sources
      const descSelectors = [
        '.woocommerce-product-details__short-description',
        '#tab-description',
        '.description',
        '[itemprop="description"]',
        '.product-description'
      ];
      
      for (const selector of descSelectors) {
        const el = document.querySelector(selector);
        if (el?.textContent?.trim()) {
          const text = el.textContent.trim().replace(/\s+/g, ' ');
          if (!result.description || text.length > result.description.length) {
            result.description = text;
          }
        }
      }

      // Images - comprehensive collection
      const seen = new Set();
      
      // Try lightbox images first
      const lightboxSelectors = [
        '.wpgs-for a.wpgs-lightbox-icon',
        '.woocommerce-product-gallery a',
        '.product-gallery a',
        'a.zoom'
      ];
      
      for (const selector of lightboxSelectors) {
        const links = document.querySelectorAll(selector);
        for (const link of links) {
          if (link.href && !link.href.includes('javascript:')) {
            const abs = new URL(link.href, window.location.href).href;
            if (!seen.has(abs) && /\.(jpg|jpeg|png|webp|gif)/i.test(abs)) {
              seen.add(abs);
              result.assets.push(abs);
            }
          }
        }
        if (result.assets.length > 0) break;
      }

      // Fallback to main images
      if (result.assets.length === 0) {
        const imgSelectors = [
          '.single-product-main-image img',
          '.woocommerce-product-gallery img',
          '.product-images img',
          '.wpgs-thumb-img',
          '.product-image img'
        ];
        
        for (const selector of imgSelectors) {
          const images = document.querySelectorAll(selector);
          for (const img of images) {
            let src = img.src || img.getAttribute('data-src') || img.getAttribute('data-large_image');
            if (src && !src.includes('data:') && /\.(jpg|jpeg|png|webp|gif)/i.test(src)) {
              const abs = new URL(src, window.location.href).href;
              if (!seen.has(abs)) {
                seen.add(abs);
                result.assets.push(abs);
              }
            }
          }
          if (result.assets.length > 0) break;
        }
      }

      return result;
    });

    console.log(`   ✅ ${data.name || 'Untitled'} | Price: ${data.price || 'N/A'} | Stock: ${data.stock || 'N/A'}`);
    return data;

  } catch (e) {
    console.error(`   ❌ Failed to scrape product: ${e.message}`);
    return null;
  }
}

function productToVendureRows(product) {
  if (!product.name) return [];

  const categories = (product.categories || []).map(cat => `category:${cat}`).join('|');
  const assets = (product.assets || []).join('|');
  const description = (product.description || '').replace(/"/g, '""');
  const price = extractPrice(product.price);

  return [{
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
  }];
}

function toVendureCSV(products, outPath) {
  console.log(`💾 Writing ${products.length} products to CSV...`);
  
  const allRows = [];
  for (const product of products) {
    const rows = productToVendureRows(product);
    allRows.push(...rows);
  }

  const csv = Papa.unparse(allRows, {
    quotes: true,
    header: true,
    columns: [
      'name', 'slug', 'description', 'assets', 'facets',
      'optionGroups', 'optionValues', 'sku', 'price',
      'taxCategory', 'stockOnHand', 'trackInventory',
      'variantAssets', 'variantFacets'
    ]
  });

  fs.writeFileSync(outPath, csv, 'utf-8');
  console.log(`   ✅ Saved ${allRows.length} rows to ${outPath}`);
}

async function setupStealthContext() {
  console.log('🕵️  Setting up stealth browser...');
  
  const browser = await chromium.launch({
    headless: CONFIG.headless,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
      '--no-sandbox',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-site-isolation-trials',
      '--disable-component-extensions-with-background-pages',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-plugins',
      '--mute-audio'
    ]
  });
  
  const randomUA = getRandomUserAgent();
  console.log(`   Using User Agent: ${randomUA.substring(0, 50)}...`);
  
  const context = await browser.newContext({
    userAgent: randomUA,
    viewport: { width: 1920, height: 1080 },
    screen: { width: 1920, height: 1080 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
    hasTouch: false,
    colorScheme: 'light',
    permissions: ['geolocation'],
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'DNT': '1'
    }
  });
  
  // Block unnecessary resources to reduce fingerprints
  await context.route('**/*', (route) => {
    const resourceType = route.request().resourceType();
    const url = route.request().url();
    
    // Block tracking and unnecessary resources
    const blockPatterns = [
      /google-analytics/,
      /facebook\.com\/tr/,
      /hotjar\.com/,
      /doubleclick\.net/,
      /googlesyndication/,
      /googletagmanager/,
      /googletagservices/,
      /googlesyndication/,
      /connect\.facebook\.net/,
      /analytics\.twitter\.com/,
      /adsystem/,
      /adservice/
    ];
    
    if (['image', 'font', 'media'].includes(resourceType) || 
        blockPatterns.some(pattern => pattern.test(url))) {
      route.abort();
    } else {
      route.continue();
    }
  });
  
  const page = await context.newPage();
  
  // Apply stealth plugins if enabled
  if (CONFIG.stealth) {
    console.log('   Applying stealth evasions...');
    await stealth_async(page);
  }
  
  return { browser, page };
}

async function main() {
  const startTime = Date.now();
  
  const { browser, page } = await setupStealthContext();

  try {
    console.log('🌐 Starting scraping process...');
    
    const categoryPages = await collectCategoryPages(page, CONFIG.startUrl, CONFIG.maxPages);
    
    let allProductUrls = [];
    for (const catPage of categoryPages) {
      const links = await collectProductLinks(page, catPage);
      allProductUrls = allProductUrls.concat(links);
      await sleep(humanDelay());
    }
    
    allProductUrls = uniq(allProductUrls);
    console.log(`\n📊 Total unique products found: ${allProductUrls.length}\n`);

    if (allProductUrls.length === 0) {
      console.warn('⚠️  No products found - check if blocked or selectors need updating');
      await browser.close();
      return;
    }

    const results = [];
    let successCount = 0;
    let failCount = 0;
    
    for (const url of allProductUrls) {
      const data = await scrapeProduct(page, url);
      if (data) {
        results.push(data);
        successCount++;
      } else {
        failCount++;
      }
      
      // Variable delay between products
      await sleep(humanDelay());
    }
    
    console.log(`\n✅ Successfully scraped ${successCount} products`);
    console.log(`❌ Failed to scrape ${failCount} products`);
    console.log(`📊 Success rate: ${((successCount / allProductUrls.length) * 100).toFixed(1)}%\n`);

    if (results.length > 0) {
      toVendureCSV(results, CONFIG.outFile);
      
      if (CONFIG.jsonOut) {
        fs.writeFileSync(CONFIG.jsonOut, JSON.stringify(results, null, 2));
        console.log(`📁 JSON output: ${CONFIG.jsonOut}`);
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const minutes = (elapsed / 60).toFixed(1);
    console.log(`\n🎉 Scraping completed in ${elapsed}s (${minutes}min)`);
    console.log(`📁 CSV output: ${CONFIG.outFile}`);

  } catch (e) {
    console.error('💥 Fatal error:', e);
  } finally {
    await browser.close();
    console.log('🔚 Browser closed');
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received shutdown signal...');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

main().catch(console.error);