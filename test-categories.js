// test-categories.js - Test rápido del sistema de categorías
// Usage: node test-categories.js
// Verifica que Facets y Collections estén configurados correctamente

import { GraphQLClient } from 'graphql-request';
import fetch from 'cross-fetch';

const ADMIN_API = process.env.ADMIN_API || 'http://127.0.0.1:3000/admin-api';
const ADMIN_USER = process.env.ADMIN_USER || 'superadmin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'superadmin';
const VENDURE_CHANNEL = process.env.VENDURE_CHANNEL || null;

// -------------------- Login --------------------
async function login() {
  const LOGIN = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        __typename
        ... on CurrentUser { id identifier }
        ... on ErrorResult { message errorCode }
      }
    }
  `;

  const res = await fetch(ADMIN_API, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      query: LOGIN,
      variables: { username: ADMIN_USER, password: ADMIN_PASS },
    }),
  });

  const data = await res.json();
  
  if (data?.data?.login?.__typename !== 'CurrentUser') {
    const msg = data?.data?.login?.message || 'Login fallido';
    throw new Error(`Login fallido: ${msg}`);
  }

  const rawCookies = res.headers.raw()['set-cookie'];
  const cookie = rawCookies
    .map(c => c.split(';')[0].trim())
    .filter(Boolean)
    .join('; ');
  
  return cookie;
}

// -------------------- Queries --------------------
async function checkFacets(client) {
  const QUERY = `
    query GetFacets {
      facets(options: { filter: { code: { eq: "category" } } }) {
        items {
          id
          code
          name
          isPrivate
          values {
            id
            code
            name
          }
        }
      }
    }
  `;
  
  const res = await client.request(QUERY);
  return res?.facets?.items || [];
}

async function checkCollections(client) {
  const QUERY = `
    query GetCollections {
      collections(options: { take: 100 }) {
        totalItems
        items {
          id
          slug
          name
          isPrivate
          parent { name }
          filters {
            code
            args {
              name
              value
            }
          }
          productVariants {
            totalItems
          }
        }
      }
    }
  `;
  
  const res = await client.request(QUERY);
  return res?.collections || { totalItems: 0, items: [] };
}

async function getProductsWithCategories(client, limit = 5) {
  const QUERY = `
    query GetProducts($take: Int!) {
      products(options: { take: $take }) {
        items {
          id
          name
          slug
          facetValues {
            facet {
              code
              name
            }
            code
            name
          }
        }
      }
    }
  `;
  
  const res = await client.request(QUERY, { take: limit });
  return res?.products?.items || [];
}

// -------------------- Display --------------------
function displayFacets(facets) {
  if (facets.length === 0) {
    console.log('  ⚠ No se encontró el Facet "category"');
    console.log('  → Ejecutá el import primero: node import-products.js');
    return;
  }
  
  for (const facet of facets) {
    console.log(`\n  📋 Facet: ${facet.name} (code: ${facet.code})`);
    console.log(`     Público: ${!facet.isPrivate ? '✓' : '✗'}`);
    console.log(`     FacetValues: ${facet.values.length}`);
    
    if (facet.values.length > 0) {
      console.log('     ├─ Valores:');
      facet.values.slice(0, 10).forEach((v, i) => {
        const prefix = i === facet.values.length - 1 ? '     └─' : '     ├─';
        console.log(`${prefix} ${v.name} (${v.code})`);
      });
      
      if (facet.values.length > 10) {
        console.log(`     └─ ... y ${facet.values.length - 10} más`);
      }
    }
  }
}

function displayCollections(collections) {
  console.log(`\n  📦 Collections: ${collections.totalItems} total`);
  
  if (collections.items.length === 0) {
    console.log('  ⚠ No hay Collections creadas');
    console.log('  → Ejecutá el import primero: node import-products.js');
    return;
  }
  
  console.log('  ├─ Primeras Collections:');
  
  collections.items.slice(0, 15).forEach((c, i) => {
    const prefix = i === collections.items.length - 1 ? '  └─' : '  ├─';
    const parentInfo = c.parent ? ` (hija de "${c.parent.name}")` : '';
    const products = c.productVariants.totalItems;
    
    console.log(`${prefix} ${c.name} (${c.slug})${parentInfo}`);
    console.log(`     ${products} producto${products === 1 ? '' : 's'} | Público: ${!c.isPrivate ? '✓' : '✗'}`);
    
    // Mostrar filtros
    if (c.filters && c.filters.length > 0) {
      c.filters.forEach(f => {
        console.log(`     Filtro: ${f.code}`);
        f.args.forEach(arg => {
          const val = arg.value.length > 50 ? arg.value.substring(0, 50) + '...' : arg.value;
          console.log(`       ${arg.name}: ${val}`);
        });
      });
    }
  });
  
  if (collections.items.length > 15) {
    console.log(`  └─ ... y ${collections.items.length - 15} más`);
  }
}

function displayProducts(products) {
  console.log(`\n  🛍️  Productos con categorías (muestra de ${products.length}):`);
  
  if (products.length === 0) {
    console.log('  ⚠ No hay productos importados todavía');
    console.log('  → Ejecutá el import primero: node import-products.js');
    return;
  }
  
  products.forEach((p, i) => {
    const categoryFacets = p.facetValues.filter(fv => fv.facet.code === 'category');
    
    if (categoryFacets.length > 0) {
      const prefix = i === products.length - 1 ? '  └─' : '  ├─';
      console.log(`${prefix} ${p.name} (${p.slug})`);
      console.log(`     Categorías: ${categoryFacets.map(fv => fv.name).join(', ')}`);
    }
  });
}

// -------------------- Main --------------------
(async () => {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║       TEST: SISTEMA DE CATEGORÍAS                         ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  try {
    console.log('→ Conectando a Admin API:', ADMIN_API);
    const cookie = await login();
    console.log('✓ Autenticado\n');
    
    const headers = VENDURE_CHANNEL
      ? { cookie, 'vendure-token': VENDURE_CHANNEL }
      : { cookie };
    
    const client = new GraphQLClient(ADMIN_API, { fetch, headers });
    
    // 1. Verificar Facets
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1️⃣  FACETS & FACET VALUES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const facets = await checkFacets(client);
    displayFacets(facets);
    
    // 2. Verificar Collections
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('2️⃣  COLLECTIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const collections = await checkCollections(client);
    displayCollections(collections);
    
    // 3. Verificar Productos
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('3️⃣  PRODUCTOS CON CATEGORÍAS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const products = await getProductsWithCategories(client, 10);
    displayProducts(products);
    
    // Resumen
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                      RESUMEN                              ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    
    const categoryFacet = facets.find(f => f.code === 'category');
    const facetValuesCount = categoryFacet ? categoryFacet.values.length : 0;
    const collectionsCount = collections.totalItems;
    const productsWithCat = products.filter(p => 
      p.facetValues.some(fv => fv.facet.code === 'category')
    ).length;
    
    console.log(`║  📋 FacetValues en "category": ${facetValuesCount.toString().padStart(3)}                    ║`);
    console.log(`║  📦 Collections creadas:       ${collectionsCount.toString().padStart(3)}                    ║`);
    console.log(`║  🛍️  Productos con categorías: ${productsWithCat.toString().padStart(3)} / ${products.length.toString().padStart(3)}               ║`);
    console.log('╚═══════════════════════════════════════════════════════════╝');
    
    // Recomendaciones
    if (facetValuesCount === 0) {
      console.log('\n⚠️  No hay FacetValues en el Facet "category"');
      console.log('   → Ejecutá el import: node import-products.js');
    } else if (collectionsCount === 0) {
      console.log('\n⚠️  Hay FacetValues pero no Collections');
      console.log('   → Esto es inusual. Revisá los logs del import.');
    } else {
      console.log('\n✅ El sistema de categorías está funcionando correctamente');
      console.log('\n📍 Próximos pasos:');
      console.log('   • Ver en Admin UI: ' + ADMIN_API.replace('/admin-api', '/admin') + '/catalog/facets');
      console.log('   • Ver Collections: ' + ADMIN_API.replace('/admin-api', '/admin') + '/catalog/collections');
      console.log('   • Probar filtros en Shop API (ver CATEGORIES.md)');
    }
    
  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    process.exit(1);
  }
})();

