# Guía para Adaptar Scraper a Diferentes Estructuras HTML

## 📋 Descripción General

Esta guía proporciona un framework para modificar el scraper existente y adaptarlo a diferentes estructuras HTML de páginas de WooCommerce, manteniendo el formato de exportación compatible con Vendure.

## 🎯 Estructura del Markdown para IA

```markdown
# Adaptación de Scraper para Nuevo Sitio

## Análisis del HTML Objetivo

### 1. Identificación de Selectores Clave

**URL de ejemplo:** [proporcionar URL específica]

**Estructura HTML encontrada:**
```html
[pegar aquí el HTML específico de la página]
```

### 2. Mapeo de Elementos

| Elemento | Selector Actual | Selector Nuevo | Notas |
|----------|-----------------|----------------|-------|
| Producto en lista | `article.product` | `[nuevo selector]` | [observaciones] |
| Título producto | `h1.product_title` | `[nuevo selector]` | |
| Precio | `.price .woocommerce-Price-amount` | `[nuevo selector]` | |
| SKU | `.sku` | `[nuevo selector]` | |
| Imágenes | `.woocommerce-product-gallery__image` | `[nuevo selector]` | |
| Descripción | `#tab-description` | `[nuevo selector]` | |
| Categorías | `.product_meta .posted_in a` | `[nuevo selector]` | |
| Variantes | `form.variations_form` | `[nuevo selector]` | |

### 3. Modificaciones Requeridas

#### A. Función `collectProductLinksFromCategory`
```javascript
// CAMBIAR de:
const links = await page.$$eval('article.product', articles => {
  // lógica actual
});

// CAMBIAR a:
const links = await page.$$eval('[NUEVO_SELECTOR_PRODUCTOS]', articles => {
  // nueva lógica basada en HTML objetivo
});
```

#### B. Función `scrapeProduct`
```javascript
// Actualizar cada selector dentro de page.evaluate():
const data = await page.evaluate(() => {
  // Título
  const titleEl = document.querySelector('[NUEVO_SELECTOR_TITULO]');
  
  // Precio  
  const priceEl = document.querySelector('[NUEVO_SELECTOR_PRECIO]');
  
  // SKU
  const skuEl = document.querySelector('[NUEVO_SELECTOR_SKU]');
  
  // Imágenes
  const galleryImages = document.querySelectorAll('[NUEVO_SELECTOR_IMAGENES]');
  
  // Descripción
  const descTab = document.querySelector('[NUEVO_SELECTOR_DESCRIPCION]');
  
  // Categorías
  const categoryLinks = document.querySelectorAll('[NUEVO_SELECTOR_CATEGORIAS]');
  
  // Variantes
  const varForm = document.querySelector('[NUEVO_SELECTOR_VARIANTES]');
});
```

#### C. Función `extractPrice` (si es necesario)
```javascript
// Modificar si el formato de precio es diferente
function extractPrice(priceText) {
  // Nueva lógica de extracción basada en el formato objetivo
}
```

### 4. Casos Especiales a Considerar

- [ ] Productos con variantes complejas
- [ ] Múltiples formatos de precio (oferta/regular)
- [ ] Galerías de imágenes no estándar
- [ ] Descripciones en pestañas/tabs diferentes
- [ ] Stock/Inventario en ubicación diferente

### 5. Testing y Validación

**Comandos de prueba:**
```bash
node scraper-vendure.js --startUrl="[URL_OBJETIVO]" --maxPages=1 --headless=false
```

**Validar:**
- [ ] Todos los productos se detectan
- [ ] Precios se extraen correctamente
- [ ] Imágenes se capturan
- [ ] Variantes se procesan adecuadamente
- [ ] CSV generado es válido para Vendure
```

## 🔧 Script de Adaptación Automática

```javascript
// adapt-scraper.js - Herramienta para adaptar scraper a nuevo HTML
import fs from 'fs';
import path from 'path';

class ScraperAdapter {
  constructor(targetHtml, targetUrl) {
    this.targetHtml = targetHtml;
    this.targetUrl = targetUrl;
    this.selectors = {};
    this.modifications = [];
  }
  
  analyzeHtml() {
    console.log('🔍 Analizando estructura HTML...');
    
    // Análisis básico de la estructura
    this.detectProductList();
    this.detectProductDetails();
    this.detectPriceFormat();
    this.detectImageGallery();
    
    return this.generateModificationGuide();
  }
  
  detectProductList() {
    // Buscar patrones comunes de listas de productos
    const patterns = [
      { pattern: 'product type-product', type: 'class' },
      { pattern: 'woocommerce-loop-product', type: 'class' },
      { pattern: '/product/', type: 'href' },
      { pattern: 'add-to-cart', type: 'attribute' }
    ];
    
    patterns.forEach(pattern => {
      if (this.targetHtml.includes(pattern.pattern)) {
        console.log(`✓ Detectado patrón: ${pattern.pattern}`);
      }
    });
  }
  
  detectProductDetails() {
    // Detectar elementos de detalles del producto
    const elements = {
      title: ['product_title', 'product-title', 'entry-title'],
      price: ['price', 'woocommerce-Price-amount'],
      sku: ['sku', 'product_meta'],
      images: ['woocommerce-product-gallery', 'product-gallery', 'wpgs'],
      description: ['description', 'woocommerce-Tabs-panel', 'tab-description'],
      categories: ['posted_in', 'product-category', 'product_cat']
    };
    
    Object.entries(elements).forEach(([key, selectors]) => {
      const found = selectors.find(selector => 
        this.targetHtml.includes(selector)
      );
      if (found) {
        this.selectors[key] = found;
        console.log(`✓ ${key}: ${found}`);
      }
    });
  }
  
  generateModificationGuide() {
    const guide = `
# Guía de Modificaciones para ${this.targetUrl}

## Selectores Identificados

${Object.entries(this.selectors).map(([key, value]) => 
  `- **${key}**: \`${value}\``
).join('\n')}

## Modificaciones Requeridas

### 1. collectProductLinksFromCategory
\`\`\`javascript
// REEMPLAZAR selector de productos
const links = await page.$$eval('article.product', articles => {
// CON:
const links = await page.$$eval('[SELECTOR_PRODUCTOS]', articles => {
  // Buscar elementos que contengan: ${this.selectors.title || 'título'}
  // y enlaces que incluyan "/product/"
\`\`\`

### 2. scrapeProduct - Selectores Internos
\`\`\`javascript
// DENTRO de page.evaluate(), actualizar:

// Título
const titleEl = document.querySelector('${this.selectors.title ? `.${this.selectors.title}` : 'h1.product_title'}');

// Precio
const priceEl = document.querySelector('${this.selectors.price ? `.${this.selectors.price}` : '.price'}');

// SKU
const skuEl = document.querySelector('${this.selectors.sku ? `.${this.selectors.sku}` : '.sku'}');

// Imágenes
const galleryImages = document.querySelectorAll('${this.selectors.images ? `.${this.selectors.images} img` : '.woocommerce-product-gallery__image'}');

// Descripción  
const descTab = document.querySelector('${this.selectors.description ? `#${this.selectors.description}` : '#tab-description'}');

// Categorías
const categoryLinks = document.querySelectorAll('${this.selectors.categories ? `.${this.selectors.categories} a` : '.product_meta .posted_in a'}');
\`\`\`

## Pruebas Recomendadas

1. Ejecutar con una sola página primero:
\`\`\`bash
node scraper-vendure.js --startUrl="${this.targetUrl}" --maxPages=1 --headless=false
\`\`\`

2. Verificar que todos los campos se extraen correctamente
3. Validar formato del CSV generado
    `;
    
    return guide;
  }
}

// Uso del adaptador
async function generateAdaptationGuide(htmlSnippet, url) {
  const adapter = new ScraperAdapter(htmlSnippet, url);
  const guide = adapter.analyzeHtml();
  
  // Guardar guía
  const guidePath = path.join(process.cwd(), 'scraper-adaptation-guide.md');
  fs.writeFileSync(guidePath, guide);
  console.log(`📝 Guía guardada en: ${guidePath}`);
  
  return guide;
}

// Ejemplo de uso
if (import.meta.url === `file://${process.argv[1]}`) {
  const targetHtml = `/* Pegar aquí el HTML objetivo */`;
  const targetUrl = 'https://ejemplo.com/productos/';
  
  generateAdaptationGuide(targetHtml, targetUrl);
}

export { ScraperAdapter, generateAdaptationGuide };
```

## 📝 Template de Modificaciones Específicas

```javascript
// MODIFICACIONES-ESPECIFICAS.js
// Copiar este template y rellenar con los selectores específicos

const SPECIFIC_SELECTORS = {
  // === LISTA DE PRODUCTOS ===
  productList: {
    container: 'li.product.type-product', // Contenedor de cada producto
    link: 'a.woocommerce-LoopProduct-link', // Enlace al producto
    title: 'h2.woocommerce-loop-product__title', // Título en lista
    price: 'span.price', // Precio en lista
    image: 'img.attachment-woocommerce_thumbnail' // Imagen en lista
  },
  
  // === DETALLES DEL PRODUCTO ===
  productDetail: {
    title: 'h1.product_title.entry-title',
    price: 'p.price span.woocommerce-Price-amount',
    sku: '.sku_wrapper .sku',
    stock: 'p.stock.in-stock',
    
    // Galería de imágenes
    gallery: {
      container: '.woo-product-gallery-slider',
      mainImage: '.single-product-main-image img',
      thumbnails: '.wpgs-nav img'
    },
    
    // Descripción
    description: {
      short: '.woocommerce-product-details__short-description',
      full: '.woocommerce-Tabs-panel--description'
    },
    
    // Categorías y tags
    taxonomy: {
      categories: '.posted_in a',
      tags: '.tagged_as a'
    },
    
    // Variantes (si existen)
    variants: {
      form: 'form.variations_form',
      attributes: '.variations select'
    }
  }
};

// Función modificada para el sitio específico
async function collectProductLinksFromCategory_MODIFIED(page, categoryUrl) {
  console.log(`🔗 Colectando productos desde: ${categoryUrl}`);
  
  try {
    await page.goto(categoryUrl, { waitUntil: 'domcontentloaded' });
    await sleep(randomDelay());

    // Scroll para cargar lazy loading
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 2);
    });
    await sleep(300);

    const links = await page.$$eval(SPECIFIC_SELECTORS.productList.container, articles => {
      const urls = [];
      for (const article of articles) {
        const link = article.querySelector('a[href*="/product/"]');
        if (link && link.href) {
          urls.push(link.href);
        }
      }
      return urls;
    }).catch(() => []);

    console.log(`   Encontrados ${links.length} productos`);
    return uniq(links);
  } catch (e) {
    console.error(`   ❌ Error colectando enlaces: ${e.message}`);
    return [];
  }
}

// Función de scraping modificada
async function scrapeProduct_MODIFIED(page, url, retryCount = 0) {
  try {
    console.log(`📦 Scrapeando: ${url}`);
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: CONFIG.timeout });
    await sleep(randomDelay());

    const data = await page.evaluate((selectors) => {
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
        stock: null
      };

      // === TÍTULO ===
      const titleEl = document.querySelector(selectors.productDetail.title);
      result.name = titleEl ? titleEl.innerText.trim() : null;

      // === SLUG ===
      const urlObj = new URL(window.location.href);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      const productIdx = pathParts.indexOf('product');
      result.slug = productIdx >= 0 ? pathParts[productIdx + 1] : pathParts[pathParts.length - 1];

      // === SKU ===
      const skuEl = document.querySelector(selectors.productDetail.sku);
      result.sku = skuEl ? skuEl.textContent.trim() : null;

      // === STOCK ===
      const stockEl = document.querySelector(selectors.productDetail.stock);
      result.stock = stockEl ? stockEl.textContent.trim() : null;

      // === PRECIO ===
      const priceEl = document.querySelector(selectors.productDetail.price);
      result.price = priceEl ? priceEl.innerText.trim() : null;

      // === DESCRIPCIÓN ===
      const shortDesc = document.querySelector(selectors.productDetail.description.short);
      const fullDesc = document.querySelector(selectors.productDetail.description.full);
      
      let description = '';
      if (fullDesc) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fullDesc.innerHTML;
        description = tempDiv.textContent.trim().replace(/\s+/g, ' ');
      } else if (shortDesc) {
        description = shortDesc.innerText.trim().replace(/\s+/g, ' ');
      }
      result.description = description;

      // === CATEGORÍAS ===
      const categoryLinks = document.querySelectorAll(selectors.productDetail.taxonomy.categories);
      result.categories = Array.from(categoryLinks)
        .map(a => a.innerText.trim())
        .filter(Boolean);

      // === IMÁGENES ===
      const seen = new Set();
      
      // Imágenes principales
      const mainImages = document.querySelectorAll(selectors.productDetail.gallery.mainImage);
      for (const img of mainImages) {
        if (img.src && !img.src.includes('data:')) {
          const abs = new URL(img.src, window.location.href).href;
          if (!seen.has(abs)) {
            seen.add(abs);
            result.assets.push(abs);
          }
        }
      }

      // Thumbnails
      const thumbnails = document.querySelectorAll(selectors.productDetail.gallery.thumbnails);
      for (const thumb of thumbnails) {
        if (thumb.src && !thumb.src.includes('data:')) {
          const abs = new URL(thumb.src, window.location.href).href;
          // Reemplazar tamaño thumbnail por tamaño completo si es posible
          const fullSize = abs.replace('-100x100', '').replace('-300x300', '');
          if (!seen.has(fullSize)) {
            seen.add(fullSize);
            result.assets.push(fullSize);
          }
        }
      }

      // === VARIANTES ===
      const varForm = document.querySelector(selectors.productDetail.variants.form);
      if (varForm && varForm.getAttribute('data-product_variations')) {
        try {
          const rawVariants = JSON.parse(varForm.getAttribute('data-product_variations'));
          result.variants = rawVariants.map(v => ({
            sku: v.sku || null,
            price: v.display_price || v.price || null,
            attributes: v.attributes || {},
            image: v.image?.url || v.image?.src || null
          }));
        } catch (e) {
          console.error('Error parsing variants:', e);
        }
      }

      return result;
    }, SPECIFIC_SELECTORS);

    console.log(`   ✅ ${data.name || 'Sin título'} | Stock: ${data.stock || 'N/A'}`);
    return data;

  } catch (e) {
    if (retryCount < CONFIG.retries) {
      console.warn(`   ⚠️  Reintento ${retryCount + 1}/${CONFIG.retries}: ${e.message}`);
      await sleep(randomDelay() * 2);
      return scrapeProduct_MODIFIED(page, url, retryCount + 1);
    }
    console.error(`   ❌ Falló después de ${CONFIG.retries} reintentos: ${e.message}`);
    return null;
  }
}
```

## 🚀 Comandos de Prueba

```bash
# Prueba básica
node scraper-vendure.js --startUrl="https://stanzafurniture.com/product-category/living-room/" --maxPages=1 --headless=false

# Prueba con salida específica
node scraper-vendure.js --startUrl="https://stanzafurniture.com/product-category/living-room/" --out="stanza-furniture.csv" --headless=true

# Prueba de rendimiento
node scraper-vendure.js --startUrl="https://stanzafurniture.com/product-category/living-room/" --concurrency=3 --delayMs=800
```

Esta guía proporciona un framework completo para adaptar el scraper a cualquier estructura HTML de WooCommerce mientras mantiene la compatibilidad con el formato de importación de Vendure.