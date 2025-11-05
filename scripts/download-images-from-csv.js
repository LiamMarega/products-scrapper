// === download-images-from-csv.js ===
// Toma un CSV exportado por tu scraper y descarga todas las imágenes de la columna "assets"
// Luego genera un nuevo CSV con las rutas locales (para importar a Vendure)

// Uso:
// node download-images-from-csv.js --input=vendure-products.csv --output=vendure-products-local.csv --outDir=images

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import Papa from 'papaparse';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));
const inputFile = args.input || 'vendure-products.csv';
const outputFile = args.output || 'vendure-products-local.csv';
const outDir = args.outDir || 'images';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);

    mod.get(url, response => {
      if (response.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return reject(`Status ${response.statusCode} en ${url}`);
      }
      response.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err.message);
    });
  });
}

async function processCSV() {
  console.log(`📂 Leyendo ${inputFile}...`);
  const csvText = fs.readFileSync(inputFile, 'utf8');
  const { data } = Papa.parse(csvText, { header: true });

  console.log(`Encontrados ${data.length} productos.`);

  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    if (!product.assets) continue;

    const urls = product.assets.split('|').map(u => u.trim()).filter(Boolean);
    const localPaths = [];

    for (let j = 0; j < urls.length; j++) {
      const url = urls[j];
      try {
        const ext = path.extname(new URL(url).pathname).split('?')[0] || '.jpg';
        const fileName = `${product.slug || product.name.replace(/\s+/g, '_')}_${j + 1}${ext}`;
        const localPath = path.join(outDir, fileName);
        if (!fs.existsSync(localPath)) {
          await downloadImage(url, localPath);
          console.log(`✅ Imagen descargada: ${fileName}`);
        } else {
          console.log(`↩️ Ya existe: ${fileName}`);
        }
        localPaths.push(localPath);
      } catch (err) {
        console.warn(`⚠️ Error con ${url}: ${err}`);
      }
    }

    product.assets = localPaths.join('|');
  }

  const newCsv = Papa.unparse(data);
  fs.writeFileSync(outputFile, newCsv, 'utf8');
  console.log(`\n💾 CSV generado con rutas locales: ${outputFile}`);
}

processCSV();
