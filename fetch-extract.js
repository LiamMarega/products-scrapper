#!/usr/bin/env node

import fs from 'fs/promises';
import cheerio from 'cheerio';

async function fetchAndExtract(url, outputFile) {
  try {
    // 1. Obtener HTML desde la URL
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} – ${res.statusText}`);
    }
    const html = await res.text();

    // 2. Cargar con Cheerio
    const $ = cheerio.load(html);

    // 3. Extraer cada producto
    const products = [];
    $('.products .product').each((_, el) => {
      const $el = $(el);

      const title = $el.find('.woocommerce-loop-product__title').text().trim();
      const link  = $el.find('a').attr('href') || '';
      const img   = $el.find('img').attr('src') || '';
      const price = $el.find('.price').text().trim();

      products.push({ title, link, img, price });
    });

    // 4. Guardar array de productos como JSON
    await fs.writeFile(outputFile, JSON.stringify(products, null, 2), 'utf8');
    console.log(`✅ ${products.length} productos guardados en ${outputFile}`);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

// URL y archivo de salida
const URL = 'https://garciasfamilyfurnitures.com/?s=&post_type=product';
const OUTPUT = 'products.json';

fetchAndExtract(URL, OUTPUT);