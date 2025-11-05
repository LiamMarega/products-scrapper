// scraper-vendure.js - WooCommerce → Vendure CSV Scraper
// 💡 Adaptado para Garcias Family Furniture (u otros sitios WooCommerce)
// Uso: node scraper-vendure.js --startUrl="https://tusitio.com/?s=&post_type=product"

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import Papa from 'papaparse';
import minimist from 'minimist';

// === Config ===
const CONFIG = {
  delayMs: 800,
  maxProducts: 500,
  maxImagesPerProduct: 5,
  outFile: 'vendure-products.csv',
};

const args = minimist(process.argv.slice(2));
const startUrl = args.startUrl || 'https://garciasfamilyfurnitures.com/?s=&post_type=product';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// === Utilidad para guardar CSV ===
function toVendureCSV(products, outPath) {
  const rows = products.flatMap(productToVendureRows);
  const csv = Papa.unparse(rows);
  fs.writeFileSync(outPath, csv, 'utf8');
  console.log(`💾 CSV exportado con ${rows.length} filas a ${outPath}`);
}

// === Transformar producto → formato Vendure ===
function productToVendureRows(product) {
  if (!product.name || !product.assets?.length) {
    console.warn(`⚠️  Producto omitido (sin nombre o imágenes): ${product.name || '(sin nombre)'}`);
    return [];
  }

  return [
    {
      'name': product.name,
      'slug': product.slug || '',
      'description': product.description || '',
      'assets': product.assets.join('|'),
      'price': product.price || 0,
      'sku': product.sku || '',
      'variantName': product.variantName || product.name,
      'optionGroups': '',
      'optionValues': '',
      'stockOnHand': 10,
      'trackInventory': true,
    },
  ];
}

// === Extraer links de productos desde página de listado ===
async function scrapeProductLinks(page, url) {
  console.log(`📄 Navegando: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(CONFIG.delayMs);

  const links = await page.$$eval('a.woocommerce-LoopProduct-link', as =>
    as.map(a => a.href).filter(Boolean)
  );

  console.log(`→ ${links.length} productos encontrados en esta página`);
  return links;
}

// === Scrapear datos individuales de producto ===
async function scrapeProduct(browser, url) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(CONFIG.delayMs);

    const data = await page.evaluate(() => {
      const clean = t => (t ? t.replace(/\s+/g, ' ').trim() : '');

      const name = clean(document.querySelector('.product_title')?.textContent);
      const slug = window.location.pathname.split('/').filter(Boolean).pop();
      const description = clean(document.querySelector('.woocommerce-product-details__short-description, .woocommerce-Tabs-panel--description')?.innerText);
      const priceText = clean(document.querySelector('.price')?.innerText || '');
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      const sku = clean(document.querySelector('.sku')?.textContent || '');

      const imgs = Array.from(document.querySelectorAll('.woocommerce-product-gallery__image img'))
        .map(img => img.src)
        .filter(Boolean);

      return { name, slug, description, price, sku, assets: imgs.slice(0, 5) };
    });

    console.log(`   ✅ ${data.name || 'Untitled'} - ${data.assets?.length || 0} imágenes`);

    // === Validación: solo descartar si NO tiene nombre o imágenes ===
    if (!data.name || !data.assets?.length) {
      console.warn(`   ⚠️  Producto incompleto, se descarta: ${data.name || '(sin nombre)'} → Falta título o imágenes`);
      await page.close();
      return null;
    }

    await page.close();
    return data;

  } catch (err) {
    console.error(`❌ Error en ${url}: ${err.message}`);
    await page.close();
    return null;
  }
}

// === Scrapear todos los productos con concurrencia limitada ===
async function scrapeProductsConcurrently(browser, urls, limit = 3) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < urls.length) {
      const url = urls[index++];
      const product = await scrapeProduct(browser, url);
      if (product) results.push(product);
      await sleep(CONFIG.delayMs);
    }
  }

  const workers = Array.from({ length: limit }, worker);
  await Promise.all(workers);
  return results;
}

// === MAIN ===
(async function main() {
  console.log('🛒 Iniciando Scraper → Vendure CSV');
  console.log(`Inicio: ${startUrl}`);

  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();
    let currentUrl = startUrl;
    const allProductUrls = new Set();

    while (currentUrl && allProductUrls.size < CONFIG.maxProducts) {
      const links = await scrapeProductLinks(page, currentUrl);
      links.forEach(link => allProductUrls.add(link));

      const nextPage = await page.$eval('a.next.page-numbers', a => a.href).catch(() => null);
      currentUrl = nextPage && allProductUrls.size < CONFIG.maxProducts ? nextPage : null;
    }

    console.log(`🔗 Total de productos encontrados: ${allProductUrls.size}`);

    const results = await scrapeProductsConcurrently(browser, Array.from(allProductUrls));
    const validResults = results.filter(p => p && p.name && p.assets?.length);
    const invalidCount = results.length - validResults.length;

    console.log(`\n✅ ${validResults.length} productos válidos`);
    if (invalidCount > 0) {
      console.warn(`⚠️  ${invalidCount} productos descartados por falta de nombre o imágenes`);
    }

    if (validResults.length > 0) {
      toVendureCSV(validResults, CONFIG.outFile);
    } else {
      console.warn('❌ No se generó ningún CSV: no hay productos válidos.');
    }

  } catch (err) {
    console.error('❌ Error general:', err);
  } finally {
    await browser.close();
    console.log('👋 Scraper finalizado');
  }
})();
