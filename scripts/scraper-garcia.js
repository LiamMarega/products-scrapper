// scraper-garcia.js - WooCommerce to Vendure CSV Scraper
// Ajustado para Garcias Family Furniture
// Usage: node scraper-garcia.js --startUrl="https://garciasfamilyfurnitures.com/?s=&post_type=product" [options]

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import Papa from 'papaparse';
import minimist from 'minimist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.resolve(PROJECT_ROOT, 'output');

// ============================================================================
// CLI ARGUMENT PARSING
// ============================================================================
const argv = minimist(process.argv.slice(2));

if (argv.help || argv.h || !argv.startUrl) {
  console.log(`
🛒 WooCommerce to Vendure CSV Scraper - Garcias Family Furniture
================================================================

Usage:
  node scraper-garcia.js --startUrl="<URL>" [options]

Required:
  --startUrl=<URL>           Product search URL to scrape

Options:
  --maxPages=<N>             Maximum pages to scrape (default: all)
  --delayMs=<N>              Base delay between requests in ms (default: 400)
  --out=<file>               Output CSV file (default: output/vendure-import.csv)
  --jsonOut=<file>           Output JSON file (optional)
  --headless=<true|false>    Run in headless mode (default: false)
  --concurrency=<N>          Product scraping concurrency (default: 2)
  --help, -h                 Show this help

Example:
  node scripts/scraper-garcia.js --startUrl="https://garciasfamilyfurnitures.com/?s=&post_type=product" --out=garcias-furniture.csv
`);
  process.exit(argv.help || argv.h ? 0 : 1);
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Resolve output file path
function resolveOutputPath(filePath) {
  if (!filePath) return path.resolve(OUTPUT_DIR, 'vendure-import.csv');
  if (path.isAbsolute(filePath)) return filePath;
  // If relative path, put it in output directory
  return path.resolve(OUTPUT_DIR, filePath);
}

const CONFIG = {
  startUrl: argv.startUrl,
  maxPages: parseInt(argv.maxPages) || Infinity,
  delayMs: parseInt(argv.delayMs) || 400,
  outFile: resolveOutputPath(argv.out),
  jsonOut: argv.jsonOut ? resolveOutputPath(argv.jsonOut) : null,
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

// (Opcional) Extract current price from WooCommerce format (no la usamos directamente)
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

// Precio -> string en centavos (ej: "1299.00" -> "129900")
function priceToCentsString(priceText) {
  if (!priceText && priceText !== 0) return '';
  const numeric = String(priceText)
    .replace(/[^0-9.,]/g, '')
    .replace(',', '.')
    .trim();

  if (!numeric) return '';

  const value = parseFloat(numeric);
  if (!isFinite(value)) return '';

  const cents = Math.round(value * 100);
  return String(cents);
}

function normalizeAttributeName(attrKey) {
  return String(attrKey)
    .replace(/^attribute_pa_/i, '')
    .replace(/^attribute_/i, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

// ==== NUEVO: helpers para generar SKUs siempre ===============================

function generateSkuBase(product) {
  const fromSlug = product.slug && String(product.slug).trim();
  const fromName = product.name && String(product.name).trim();

  const baseSource = fromSlug || fromName || 'sku';

  return (
    baseSource
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'sku'
  );
}

function generateSku(product, index = null) {
  const base = generateSkuBase(product);
  if (index === null) return base;
  return `${base}-${index}`;
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
// PAGINATION LOGIC - MODIFICADO PARA GARCIAS
// ============================================================================

async function collectCategoryPages(page, startUrl, maxPages) {
  console.log('📄 Collecting category pages...');
  
  await page.goto(startUrl, { waitUntil: 'domcontentloaded' });
  await sleep(randomDelay());

  const pages = [startUrl];
  
  try {
    // Para Garcias Family Furniture, buscamos paginación específica
    const paginationLinks = await page.$$eval(
      'a.page-numbers:not(.next):not(.prev)',
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
// PRODUCT LINK COLLECTION - MODIFICADO PARA GARCIAS
// ============================================================================

async function collectProductLinksFromCategory(page, categoryUrl) {
  console.log(`🔗 Collecting products from: ${categoryUrl}`);
  
  try {
    await page.goto(categoryUrl, { waitUntil: 'domcontentloaded' });
    await sleep(randomDelay());

    // Scroll para cargar todos los productos
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 2);
    });
    await sleep(300);

    // Selectores específicos para Garcias Family Furniture
    const links = await page.$$eval('li.product', articles => {
      const urls = [];
      for (const article of articles) {
        const link = article.querySelector('a.woocommerce-LoopProduct-link');
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
// PRODUCT SCRAPING - MODIFICADO PARA GARCIAS
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
        product_type: null,
        stockOnHand: null
      };

      // Title - Selector específico para Garcias
      const titleEl = document.querySelector('h1.product_title, h1.product-title, h1.entry-title');
      result.name = titleEl ? titleEl.innerText.trim() : null;

      // Slug from URL
      const urlObj = new URL(window.location.href);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      const productIdx = pathParts.indexOf('product');
      result.slug = productIdx >= 0 ? pathParts[productIdx + 1] : pathParts[pathParts.length - 1];

      // SKU - Buscar en diferentes ubicaciones
      const skuEl = document.querySelector('.sku, [itemprop="sku"], .product_meta .sku_wrapper .sku');
      result.sku = skuEl ? skuEl.textContent.trim() : null;

      // Product Type basado en clases
      const article = document.querySelector('article[class*="product-type-"]');
      if (article) {
        const typeMatch = article.className.match(/product-type-(\w+)/);
        result.product_type = typeMatch ? typeMatch[1] : 'simple';
      }

      // Description - Combinar descripción corta y larga
      const shortDescEl = document.querySelector('.woocommerce-product-details__short-description');
      let description = shortDescEl ? shortDescEl.innerText.trim() : '';

      // Intentar obtener descripción larga de tabs
      const descTab = document.querySelector('#tab-description, .woocommerce-Tabs-panel--description');
      if (descTab) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = descTab.innerHTML;
        const longDesc = tempDiv.textContent.trim().replace(/\s+/g, ' ');
        if (longDesc) {
          description = description ? `${description} ${longDesc}` : longDesc;
        }
      }

      result.description = description;

      // Price - Selector específico para Garcias
      const priceEl = document.querySelector('.price, p.price, .elementor-widget-woocommerce-product-price .price');
      result.price = priceEl ? priceEl.innerText.trim() : null;

      // Categories from breadcrumb - Específico para Garcias
      const breadcrumbLinks = document.querySelectorAll('.woocommerce-breadcrumb a');
      const categories = Array.from(breadcrumbLinks)
        .map(a => a.innerText.trim())
        .filter(text => text !== 'Home');
      
      result.categories = categories;

      // Stock information
      const stockEl = document.querySelector('.stock.in-stock, .remaining');
      if (stockEl) {
        const stockText = stockEl.innerText.trim();
        const stockMatch = stockText.match(/(\d+)/);
        if (stockMatch) {
          result.stockOnHand = parseInt(stockMatch[1]);
        }
      }

      // Images from gallery - Adaptado para Garcias
      const seen = new Set();
      
      // Primero intentar con el carrusel principal
      const mainImages = document.querySelectorAll('.woocommerce-product-gallery__image a');
      for (const link of mainImages) {
        if (link.href && !link.href.includes('javascript:')) {
          const abs = new URL(link.href, window.location.href).href;
          if (!seen.has(abs)) {
            seen.add(abs);
            result.assets.push(abs);
          }
        }
      }

      // Si no hay imágenes principales, buscar en thumbnails
      if (result.assets.length === 0) {
        const thumbImages = document.querySelectorAll('.flex-control-thumbs img');
        for (const img of thumbImages) {
          if (img.src && !img.src.includes('data:')) {
            // Intentar obtener la imagen grande
            const largeSrc = img.getAttribute('data-large_image') || 
                            img.getAttribute('data-src') || 
                            img.src.replace('-100x100', '').replace('-270x270', '');
            const abs = new URL(largeSrc, window.location.href).href;
            if (!seen.has(abs)) {
              seen.add(abs);
              result.assets.push(abs);
            }
          }
        }
      }

      // Variants - Específico para Garcias
      const varForm = document.querySelector('form.variations_form');
      if (varForm && varForm.getAttribute('data-product_variations')) {
        try {
          const rawVariants = JSON.parse(varForm.getAttribute('data-product_variations'));
          result.variants = rawVariants.map(v => ({
            sku: v.sku || null,
            price: v.display_price || v.display_regular_price || null,
            attributes: v.attributes || {},
            image: v.image?.url || v.image?.src || null,
            stock: v.max_qty || null,
            variation_id: v.variation_id || null
          }));
        } catch (e) {
          console.warn('Error parsing variants:', e);
        }
      }

      // Si no hay variantes pero es tipo variable, crear una variante simple
      if (result.variants.length === 0 && result.product_type === 'variable') {
        result.variants = [{
          sku: result.sku,
          price: result.price,
          attributes: {},
          image: result.assets[0] || null,
          stock: result.stockOnHand
        }];
      }

      return result;
    });

    console.log(`   ✅ ${data.name || 'Untitled'} - ${data.variants?.length || 1} variants`);
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
// CONCURRENT SCRAPING (con filtro de productos sin título o imágenes)
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

        if (data) {
          const hasName = !!(data.name && data.name.trim());
          const hasImages = Array.isArray(data.assets) && data.assets.length > 0;

          if (!hasName || !hasImages) {
            console.log('   ⏭️  Skip: producto sin título o sin imágenes');
          } else {
            results.push(data);
          }
        }
        
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
  // Filtro extra por seguridad
  if (!product.name) return [];
  if (!product.assets || product.assets.length === 0) return [];

  const rows = [];
  
  // Preparar categorías para facets
  const categories = (product.categories || [])
    .map(cat => `category:${cat}`)
    .join('|');

  const assets = (product.assets || []).join('|');
  const description = (product.description || '').replace(/"/g, '""'); // Escape quotes

  // Determinar stock por defecto
  const defaultStock = product.stockOnHand || 100;

  // Productos con variantes
  if (product.variants && product.variants.length > 1) {
    const optionGroupsSet = new Set();
    
    // Recopilar todos los atributos únicos de las variantes
    product.variants.forEach(variant => {
      Object.keys(variant.attributes || {}).forEach(attrKey => {
        if (variant.attributes[attrKey]) {
          optionGroupsSet.add(normalizeAttributeName(attrKey));
        }
      });
    });
    
    const optionGroupsArray = Array.from(optionGroupsSet);
    const optionGroups = optionGroupsArray.join('|');

    // Crear filas para cada variante
    product.variants.forEach((variant, index) => {
      const optionValues = optionGroupsArray.map(group => {
        const attrKey = Object.keys(variant.attributes || {})
          .find(k => normalizeAttributeName(k) === group);
        return attrKey ? (variant.attributes[attrKey] || '') : '';
      }).join('|');

      const priceCents = priceToCentsString(variant.price || product.price);
      const variantStock = variant.stock || defaultStock;

      // SKU SIEMPRE presente
      const variantSku =
        (variant.sku && String(variant.sku).trim()) ||
        (product.sku && String(product.sku).trim()) ||
        generateSku(product, index);

      if (index === 0) {
        // Primera fila: datos del producto + primera variante
        rows.push({
          name: product.name,
          slug: product.slug || '',
          description: description,
          assets: assets,
          facets: categories,
          optionGroups: optionGroups,
          optionValues: optionValues,
          sku: variantSku,
          price: priceCents,
          taxCategory: 'standard',
          stockOnHand: variantStock.toString(),
          trackInventory: 'true',
          variantAssets: variant.image || '',
          variantFacets: ''
        });
      } else {
        // Filas siguientes: solo datos de variante
        rows.push({
          name: '',
          slug: '',
          description: '',
          assets: '',
          facets: '',
          optionGroups: '',
          optionValues: optionValues,
          sku: variantSku,
          price: priceCents,
          taxCategory: 'standard',
          stockOnHand: variantStock.toString(),
          trackInventory: 'true',
          variantAssets: variant.image || '',
          variantFacets: ''
        });
      }
    });
  } else {
    // Producto simple (sin variantes o solo una variante)
    const variant = product.variants && product.variants.length === 1 ? product.variants[0] : null;
    const priceCents = priceToCentsString(variant ? variant.price : product.price);

    let sku =
      (variant && variant.sku && String(variant.sku).trim()) ||
      (product.sku && String(product.sku).trim()) ||
      generateSku(product); // fallback SIEMPRE

    const stock = (variant && variant.stock) || product.stockOnHand || defaultStock;

    rows.push({
      name: product.name,
      slug: product.slug || '',
      description: description,
      assets: assets,
      facets: categories,
      optionGroups: '',
      optionValues: '',
      sku: sku, // nunca vacío
      price: priceCents,
      taxCategory: 'standard',
      stockOnHand: stock.toString(),
      trackInventory: 'true',
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

    if (rows.length === 0) {
      console.log(`   ⏭️  Producto omitido en CSV por falta de título o imágenes: ${product.name || product.slug || '(sin nombre)'}`);
      continue;
    }

    allRows.push(...rows);
  }

  if (allRows.length === 0) {
    console.warn('⚠️  No hay filas válidas para escribir en el CSV');
    return;
  }

  // Usar papaparse para generar CSV correcto
  const csv = Papa.unparse(allRows, {
    quotes: true, // Quote all fields
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ',',
    header: true,
    newline: '\n'
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

    // Paso 1: Recopilar todas las páginas de categorías
    const categoryPages = await collectCategoryPages(page, CONFIG.startUrl, CONFIG.maxPages);
    
    // Paso 2: Recopilar todos los enlaces de productos
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

    // Paso 3: Scrapear todos los productos
    const results = await scrapeProductsConcurrently(browser, allProductUrls);
    
    console.log(`\n✅ Successfully scraped ${results.length} products\n`);

    // Paso 4: Exportar a CSV de Vendure
    if (results.length > 0) {
      toVendureCSV(results, CONFIG.outFile);
      
      // Exportar JSON si se solicita
      if (CONFIG.jsonOut) {
        console.log(`💾 Writing JSON to: ${CONFIG.jsonOut}...`);
        fs.writeFileSync(CONFIG.jsonOut, JSON.stringify(results, null, 2), 'utf-8');
        console.log(`   ✅ JSON saved successfully`);
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 Done in ${elapsed}s`);
    console.log(`\n📁 Import file created: ${CONFIG.outFile}`);
    if (CONFIG.jsonOut) {
      console.log(`📁 JSON file created: ${CONFIG.jsonOut}`);
    }
    console.log(`   Use this file with Vendure's populate() function`);

  } catch (e) {
    console.error('💥 Fatal error:', e);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

// Ejecutar
main().catch(console.error);
