// fix-prices.js
import fs from 'fs';
import Papa from 'papaparse';

const csvPath = 'output/vendure-products.csv';

// Leer CSV
const csvData = fs.readFileSync(csvPath, 'utf8');
const parsed = Papa.parse(csvData, { header: true });

// Cambiar precio 0 → 1
parsed.data.forEach(row => {
  if (row.price === '0' || row.price === 0) {
    row.price = 1;
  }
});

// Guardar
const newCsv = Papa.unparse(parsed.data);
fs.writeFileSync(csvPath, newCsv);
console.log('✅ Precios actualizados: 0 → 1 centavo');