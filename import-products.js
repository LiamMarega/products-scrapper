// import-products.js - Importador de productos CSV a Vendure usando GraphQL API
// Usage: node import-products.js
// CSV Path: Usar variable de entorno CSV_PATH o por defecto living-room.csv

import { GraphQLClient } from 'graphql-request';
import fetch from 'cross-fetch';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const ADMIN_API = process.env.ADMIN_API || 'http://localhost:3000/admin-api';
const ADMIN_USER = process.env.ADMIN_USER || 'superadmin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'superadmin';
const CSV_PATH = process.env.CSV_PATH || path.resolve(__dirname, 'living-room.csv');
const DEFAULT_STOCK = parseInt(process.env.DEFAULT_STOCK_ON_HAND) || 100;
const DEFAULT_LANGUAGE = process.env.DEFAULT_LANGUAGE || 'en';

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   VENDURE CSV IMPORTER - GraphQL API                      ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

console.log('→ Vendure API:', ADMIN_API);
console.log('→ CSV file:', CSV_PATH);
console.log('→ Default stock:', DEFAULT_STOCK);
console.log();

// ============================================================================
// GRAPHQL QUERIES & MUTATIONS
// ============================================================================

const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      __typename
      ... on CurrentUser { id identifier }
      ... on ErrorResult { message errorCode }
    }
  }
`;

const CREATE_PRODUCT = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      slug
      enabled
    }
  }
`;

const CREATE_PRODUCT_VARIANTS = `
  mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
    createProductVariants(input: $input) {
      id
      name
      sku
      price
    }
  }
`;

const GET_FACET_BY_CODE = `
  query GetFacet($code: String!) {
    facets(options: { filter: { code: { eq: $code } } }) {
      items {
        id
        code
        values { id code name }
      }
    }
  }
`;

const CREATE_FACET = `
  mutation CreateFacet($input: CreateFacetInput!) {
    createFacet(input: $input) {
      id
      code
      name
    }
  }
`;

const CREATE_FACET_VALUE = `
  mutation CreateFacetValue($input: CreateFacetValueInput!) {
    createFacetValues(input: [$input]) {
      id
      code
      name
    }
  }
`;

const ASSIGN_FACETS_TO_PRODUCT = `
  mutation AssignFacets($productId: ID!, $facetValueIds: [ID!]!) {
    updateProduct(input: { id: $productId, facetValueIds: $facetValueIds }) {
      id
    }
  }
`;

const CREATE_ASSETS = `
  mutation CreateAssets($input: [CreateAssetInput!]!) {
    createAssets(input: $input) {
      id
      name
      source
    }
  }
`;

const UPDATE_PRODUCT_ASSETS = `
  mutation UpdateProductAssets($productId: ID!, $assetIds: [ID!]!, $featuredAssetId: ID) {
    updateProduct(input: { id: $productId, assetIds: $assetIds, featuredAssetId: $featuredAssetId }) {
      id
      assets { id name }
      featuredAsset { id name }
    }
  }
`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Parse CSV file
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// Login and get session cookie
async function login() {
  const res = await fetch(ADMIN_API, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      query: LOGIN_MUTATION,
      variables: { username: ADMIN_USER, password: ADMIN_PASS },
    }),
  });

  const data = await res.json();
  
  if (data?.data?.login?.__typename !== 'CurrentUser') {
    const msg = data?.data?.login?.message || 'Login failed';
    throw new Error(`Login failed: ${msg}`);
  }

  const rawCookies = res.headers.raw()['set-cookie'];
  const cookie = rawCookies
    .map(c => c.split(';')[0].trim())
    .filter(Boolean)
    .join('; ');
  
  return cookie;
}

// Create a slug from a string
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Convert price string to cents (e.g., "350.00" -> 35000)
function priceToCents(priceStr) {
  const cleaned = String(priceStr).replace(/[^0-9.]/g, '');
  const price = parseFloat(cleaned) || 0;
  return Math.round(price * 100);
}

// Cache for facets
const facetCache = {
  categoryFacetId: null,
  valueByCode: new Map()
};

// Ensure category facet exists
async function ensureCategoryFacet(client) {
  if (facetCache.categoryFacetId) {
    return facetCache.categoryFacetId;
  }

  // Try to get existing
  const result = await client.request(GET_FACET_BY_CODE, { code: 'category' });
  const existing = result?.facets?.items?.[0];
  
  if (existing) {
    facetCache.categoryFacetId = existing.id;
    // Cache existing values
    for (const val of existing.values || []) {
      facetCache.valueByCode.set(val.code, val.id);
    }
    return existing.id;
  }

  // Create new facet
  const created = await client.request(CREATE_FACET, {
    input: {
      code: 'category',
      isPrivate: false,
      translations: [
        {
          languageCode: DEFAULT_LANGUAGE,
          name: 'Category'
        }
      ]
    }
  });

  facetCache.categoryFacetId = created.createFacet.id;
  return facetCache.categoryFacetId;
}

// Ensure category facet value exists
async function ensureCategoryFacetValue(client, categoryName) {
  const code = slugify(categoryName);
  
  if (facetCache.valueByCode.has(code)) {
    return facetCache.valueByCode.get(code);
  }

  const facetId = await ensureCategoryFacet(client);

  // Create new facet value
  const created = await client.request(CREATE_FACET_VALUE, {
    input: {
      facetId: facetId,
      code: code,
      translations: [
        {
          languageCode: DEFAULT_LANGUAGE,
          name: categoryName
        }
      ]
    }
  });

  const valueId = created.createFacetValues[0].id;
  facetCache.valueByCode.set(code, valueId);
  return valueId;
}

// Upload image from URL
async function uploadImageFromUrl(imageUrl, cookie) {
  try {
    // Download image
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      throw new Error(`Failed to download image: ${imageRes.statusText}`);
    }

    const buffer = await imageRes.arrayBuffer();
    const fileName = path.basename(new URL(imageUrl).pathname);

    // Create form data
    const formData = new FormData();
    
    // GraphQL operation
    const operations = JSON.stringify({
      query: `
        mutation CreateAsset($file: Upload!) {
          createAssets(input: [{ file: $file }]) {
            ... on Asset { id name source preview }
          }
        }
      `,
      variables: { file: null }
    });

    const map = JSON.stringify({
      '0': ['variables.file']
    });

    formData.append('operations', operations);
    formData.append('map', map);
    formData.append('0', Buffer.from(buffer), fileName);

    // Upload
    const uploadRes = await fetch(ADMIN_API, {
      method: 'POST',
      headers: {
        'cookie': cookie,
      },
      body: formData
    });

    const result = await uploadRes.json();
    return result?.data?.createAssets?.[0]?.id;
  } catch (error) {
    console.error(`   ⚠️  Failed to upload image ${imageUrl}: ${error.message}`);
    return null;
  }
}

// ============================================================================
// MAIN IMPORT FUNCTION
// ============================================================================

async function importProducts() {
  try {
    // Login
    console.log('🔐 Logging in...');
    const cookie = await login();
    console.log('✅ Logged in successfully\n');

    // Create GraphQL client with auth
    const client = new GraphQLClient(ADMIN_API, {
      headers: {
        cookie: cookie,
      },
      fetch: fetch
    });

    // Parse CSV
    console.log('📄 Parsing CSV file...');
    const products = await parseCSV(CSV_PATH);
    console.log(`✅ Found ${products.length} products\n`);

    // Process each product
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < products.length; i++) {
      const row = products[i];
      const productNum = i + 1;

      try {
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📦 [${productNum}/${products.length}] ${row.name}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        // 1. Create product
        const productInput = {
          enabled: true,
          translations: [
            {
              languageCode: DEFAULT_LANGUAGE,
              name: row.name,
              slug: row.slug,
              description: row.description || ''
            }
          ]
        };

        console.log('🔨 Creating product...');
        const product = await client.request(CREATE_PRODUCT, { input: productInput });
        const productId = product.createProduct.id;
        console.log(`✅ Product created (ID: ${productId})`);

        // 2. Create default variant
        const price = priceToCents(row.price);
        const variantInput = [{
          productId: productId,
          sku: row.sku || row.slug,
          price: price,
          stockOnHand: parseInt(row.stockOnHand) || DEFAULT_STOCK,
          translations: [
            {
              languageCode: DEFAULT_LANGUAGE,
              name: row.name
            }
          ]
        }];

        console.log(`💰 Creating variant (Price: $${row.price}, Stock: ${variantInput[0].stockOnHand})...`);
        await client.request(CREATE_PRODUCT_VARIANTS, { input: variantInput });
        console.log('✅ Variant created');

        // 3. Process categories (facets)
        if (row.facets) {
          console.log('🏷️  Processing categories...');
          const facets = row.facets.split('|').map(f => {
            const [key, value] = f.split(':');
            return { key: key.trim(), value: value.trim() };
          });

          const categoryFacets = facets.filter(f => f.key === 'category');
          if (categoryFacets.length > 0) {
            const facetValueIds = [];
            for (const facet of categoryFacets) {
              const valueId = await ensureCategoryFacetValue(client, facet.value);
              facetValueIds.push(valueId);
            }

            await client.request(ASSIGN_FACETS_TO_PRODUCT, {
              productId: productId,
              facetValueIds: facetValueIds
            });
            console.log(`✅ Assigned ${categoryFacets.length} categories`);
          }
        }

        // 4. Upload images
        if (row.assets) {
          const imageUrls = row.assets.split('|').map(url => url.trim()).filter(Boolean);
          if (imageUrls.length > 0) {
            console.log(`📸 Uploading ${imageUrls.length} images...`);
            const assetIds = [];
            
            for (const url of imageUrls) {
              const assetId = await uploadImageFromUrl(url, cookie);
              if (assetId) {
                assetIds.push(assetId);
              }
            }

            if (assetIds.length > 0) {
              await client.request(UPDATE_PRODUCT_ASSETS, {
                productId: productId,
                assetIds: assetIds,
                featuredAssetId: assetIds[0] // Primera imagen como destacada
              });
              console.log(`✅ Uploaded ${assetIds.length}/${imageUrls.length} images (featured: first image)`);
            }
          }
        }

        console.log(`\n✅ [${productNum}/${products.length}] Successfully imported: ${row.name}`);
        successCount++;

      } catch (error) {
        errorCount++;
        console.error(`\n❌ [${productNum}/${products.length}] Failed: ${row.name}`);
        console.error(`   Error: ${error.message}`);
        if (error.response?.errors) {
          console.error(`   GraphQL Errors:`, JSON.stringify(error.response.errors, null, 2));
        }
      }

      // Small delay between products
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    // Summary
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                    IMPORT SUMMARY                         ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📦 Total: ${products.length}`);
    console.log(`\n🌐 View your products at: ${ADMIN_API.replace('/admin-api', '/admin')}`);

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Execute
  importProducts()
    .then(() => {
    console.log('\n🎉 Import completed!');
      process.exit(0);
    })
    .catch(err => {
    console.error('\n💥 Unexpected error:', err.message);
      process.exit(1);
    });
