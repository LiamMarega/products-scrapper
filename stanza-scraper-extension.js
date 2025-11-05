(async function() {
  'use strict';
  console.log('🛒 Stanza Scraper (con descarga de imágenes Base64)');

  const CONFIG = {
    delayMs: 800,
    maxProducts: 500,
    downloadImages: true, // Toggle para descargar imágenes
    maxImagesPerProduct: 5 // Límite de imágenes por producto
  };

  function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
  
  function extractPrice(priceText){
    if(!priceText) return '';
    let text = String(priceText).replace(/[$€£¥]/g,'').trim();
    const prices = text.match(/([0-9,\.]+)/g);
    if(prices && prices.length>1) return prices[prices.length-1].replace(/,/g,'');
    if(prices && prices.length===1) return prices[0].replace(/,/g,'');
    return '';
  }

  // Descargar imagen y convertir a Base64
  async function downloadImageAsBase64(url) {
    try {
      console.log(`      📥 Downloading: ${url.substring(0, 60)}...`);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.log(`      ⚠️  HTTP ${response.status}`);
        return null;
      }

      const blob = await response.blob();
      const contentType = blob.type || 'image/jpeg';
      
      // Convertir blob a base64
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result; // ya incluye "data:image/...;base64,..."
          const sizeKB = (blob.size / 1024).toFixed(2);
          console.log(`      ✅ Downloaded ${sizeKB} KB (${contentType})`);
          resolve(base64);
        };
        reader.onerror = () => {
          console.log(`      ❌ Error reading blob`);
          resolve(null);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.log(`      ❌ Error: ${error.message}`);
      return null;
    }
  }

  // Scraper de un solo producto
  function scrapeProductFromDocument(doc, url){
    const result = {
      name: null, slug: null, description: null, assets: [], categories: [],
      price: null, sku: null, stock: null, url
    };

    const titleEl = doc.querySelector('h1.product_title.entry-title');
    result.name = titleEl?.innerText?.trim() || null;

    try {
      const parsed = new URL(url);
      const pathParts = parsed.pathname.split('/').filter(Boolean);
      const productIdx = pathParts.indexOf('product');
      result.slug = productIdx >= 0 ? pathParts[productIdx + 1] : pathParts[pathParts.length - 1];
    } catch(e){ result.slug = null; }

    const skuEl = doc.querySelector('.sku_wrapper .sku');
    result.sku = skuEl?.textContent?.trim() || null;

    const stockEl = doc.querySelector('p.stock');
    result.stock = stockEl?.textContent?.trim() || null;

    const priceEl = doc.querySelector('.summary .price');
    result.price = priceEl?.innerText?.trim() || null;

    const categoryLinks = doc.querySelectorAll('.product_meta .posted_in a');
    result.categories = Array.from(categoryLinks).map(a => a.innerText.trim()).filter(Boolean);

    const shortDescEl = doc.querySelector('.woocommerce-product-details__short-description');
    if(shortDescEl) result.description = shortDescEl.innerText.trim().replace(/\s+/g,' ');

    const descTab = doc.querySelector('#tab-product_description_tab, #tab-description');
    if(descTab){
      const tabText = descTab.textContent.trim().replace(/\s+/g,' ');
      if(tabText && tabText.length > (result.description?.length || 0)) result.description = tabText;
    }

    // Imágenes (solo URLs por ahora)
    const seen = new Set();
    const lightboxLinks = doc.querySelectorAll('.wpgs-for a.wpgs-lightbox-icon');
    for(const link of lightboxLinks){
      if(link.href && !link.href.includes('javascript:') && !seen.has(link.href)){
        seen.add(link.href);
        result.assets.push(link.href);
      }
    }
    if(result.assets.length === 0){
      const mainImages = doc.querySelectorAll('.single-product-main-image img, .woocommerce-product-gallery__image img, .gallery img');
      for(const img of mainImages){
        const largeImage = img.getAttribute('data-large_image') || img.src;
        if(largeImage && !largeImage.includes('data:') && !seen.has(largeImage)){
          seen.add(largeImage);
          result.assets.push(largeImage);
        }
      }
    }
    
    // Limitar imágenes
    result.assets = result.assets.slice(0, CONFIG.maxImagesPerProduct);
    
    return result;
  }

  function collectProductLinksFromDocument(doc){
    const products = doc.querySelectorAll('li.product, .product');
    const links = [];
    products.forEach(product => {
      const link = product.querySelector('a.woocommerce-LoopProduct-link, a');
      if(link?.href?.includes('/product/')) links.push(link.href);
    });
    return Array.from(new Set(links));
  }

  function collectPaginationLinksFromDocument(doc){
    const pageLinks = doc.querySelectorAll('.woocommerce-pagination a.page-numbers');
    const urls = new Set();
    for(const a of pageLinks){
      if(a.href && a.href.includes('/page/')){
        urls.add(a.href);
      }
    }
    return Array.from(urls);
  }

  // Scrapear todos los productos (con descarga de imágenes)
  async function scrapeAllWithFetch(urls){
    const results = JSON.parse(localStorage.getItem('stanza_scraped_products')||'[]');
    const total = Math.min(urls.length, CONFIG.maxProducts);
    console.log(`🚀 Fetching & scraping ${total} products...`);
    
    for(let i=0;i<total;i++){
      const url = urls[i];
      console.log(`\n📦 [${i+1}/${total}] ${url}`);
      try {
        const resp = await fetch(url, { credentials: 'same-origin' });
        const text = await resp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const data = scrapeProductFromDocument(doc, url);
        
        console.log(`   ✅ ${data.name || 'NO_NAME'}`);
        
        // Descargar imágenes si está habilitado
        if (CONFIG.downloadImages && data.assets.length > 0) {
          console.log(`   📸 Downloading ${data.assets.length} images...`);
          const downloadedImages = [];
          
          for (let j = 0; j < data.assets.length; j++) {
            const imageUrl = data.assets[j];
            const base64 = await downloadImageAsBase64(imageUrl);
            if (base64) {
              downloadedImages.push(base64);
            }
            await sleep(300); // Delay entre imágenes
          }
          
          // Reemplazar URLs con Base64
          data.assetsBase64 = downloadedImages;
          console.log(`   ✅ ${downloadedImages.length}/${data.assets.length} images downloaded`);
        }
        
        results.push(data);
        localStorage.setItem('stanza_scraped_products', JSON.stringify(results));
        
      } catch(err){
        console.error('   ❌ Error scraping:', err);
      }
      await sleep(CONFIG.delayMs);
    }
    console.log(`\n✅ Done. ${results.length} total products scraped.`);
    return results;
  }

  async function scrapeCategoryAllPages(){
    const startUrl = window.location.href;
    const resp = await fetch(startUrl, { credentials: 'same-origin' });
    const text = await resp.text();
    const parser = new DOMParser();
    const firstDoc = parser.parseFromString(text, 'text/html');

    const pageUrls = collectPaginationLinksFromDocument(firstDoc);
    pageUrls.unshift(startUrl);
    const uniquePageUrls = Array.from(new Set(pageUrls));

    console.log(`📄 Found ${uniquePageUrls.length} category pages`);

    let allProductLinks = [];
    for(const pageUrl of uniquePageUrls){
      console.log(`🧭 Fetching category page: ${pageUrl}`);
      const pageResp = await fetch(pageUrl, { credentials: 'same-origin' });
      const pageText = await pageResp.text();
      const doc = parser.parseFromString(pageText, 'text/html');
      const links = collectProductLinksFromDocument(doc);
      console.log(`   +${links.length} products`);
      allProductLinks.push(...links);
      await sleep(400);
    }

    allProductLinks = Array.from(new Set(allProductLinks));
    console.log(`\n🔗 Total unique product links: ${allProductLinks.length}`);
    await scrapeAllWithFetch(allProductLinks);
  }

  // CSV con Base64 embebido
  window.downloadCSV = function(){
    const dataStr = localStorage.getItem('stanza_scraped_products');
    if(!dataStr){ console.error('❌ No scraped data found'); return; }
    const products = JSON.parse(dataStr);
    const rows = [];
    
    for(const product of products){
      const categories = (product.categories||[]).map(cat=>`category:${cat}`).join('|');
      
      // Si hay imágenes Base64, usarlas; sino, usar URLs
      const assets = product.assetsBase64 
        ? product.assetsBase64.join('|||') // Separador especial para Base64
        : (product.assets||[]).join('|');
      
      const description = (product.description||'').replace(/"/g,'""');
      const price = extractPrice(product.price);
      
      rows.push({
        name: product.name||'',
        slug: product.slug||'',
        description,
        assets,
        facets: categories,
        optionGroups: '',
        optionValues: '',
        sku: product.sku||'',
        price: price,
        taxCategory: 'standard',
        stockOnHand: '100',
        trackInventory: 'false',
        variantAssets: '',
        variantFacets: '',
        assetType: product.assetsBase64 ? 'base64' : 'url' // Indicador
      });
    }
    
    const headers = ['name','slug','description','assets','facets','optionGroups','optionValues','sku','price','taxCategory','stockOnHand','trackInventory','variantAssets','variantFacets','assetType'];
    let csv = headers.join(',') + '\n';
    
    for(const row of rows){
      const values = headers.map(h=>{
        const v = row[h] || '';
        if(String(v).includes(',')||String(v).includes('"')||String(v).includes('\n')) {
          return `"${String(v).replace(/"/g,'""')}"`;
        }
        return v;
      });
      csv += values.join(',') + '\n';
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `stanza-products-base64-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('✅ CSV downloaded with Base64 images!');
  };

  window.downloadJSON = function(){
    const dataStr = localStorage.getItem('stanza_scraped_products');
    if(!dataStr){ console.error('❌ No scraped data found'); return; }
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `stanza-products-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('✅ JSON downloaded!');
  };

  // Ejecutar
  await scrapeCategoryAllPages();
  console.log('\n🎉 Scraping completed! Use downloadCSV() or downloadJSON() to export.');
})();