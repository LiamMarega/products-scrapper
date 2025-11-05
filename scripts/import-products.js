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
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.resolve(PROJECT_ROOT, 'output',);

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const ADMIN_API = process.env.ADMIN_API || 'http://localhost:3000/admin-api';
const ADMIN_USER = process.env.ADMIN_USER || 'superadmin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'superadmin';

// Resolve CSV path - default to output/living-room.csv
function resolveCSVPath(csvPath) {
  if (csvPath) {
    return path.isAbsolute(csvPath) ? csvPath : path.resolve(PROJECT_ROOT, csvPath);
  }
  return path.resolve(OUTPUT_DIR, 'vendure-products.csv');
}

const CSV_PATH = resolveCSVPath(process.env.CSV_PATH);
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
    // Log URL being downloaded
    console.log(`   📥 Downloading image: ${imageUrl}`);
    
    // Download image
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      throw new Error(`HTTP ${imageRes.status}: ${imageRes.statusText}`);
    }

    // Get content type from response headers
    const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
    console.log(`   📊 Content-Type: ${contentType}, Status: ${imageRes.status}`);

    // Validate that it's an image
    if (!contentType.startsWith('image/')) {
      throw new Error(`Invalid content type: ${contentType}. Expected image/*`);
    }

    const buffer = await imageRes.arrayBuffer();
    const bufferSize = buffer.byteLength;
    console.log(`   📦 Downloaded ${(bufferSize / 1024).toFixed(2)} KB`);

    if (bufferSize === 0) {
      throw new Error('Downloaded image is empty');
    }

    // Get filename from URL or generate one
    let fileName = path.basename(new URL(imageUrl).pathname);
    if (!fileName || !fileName.includes('.')) {
      // Determine extension from content type
      const ext = contentType.split('/')[1] || 'jpg';
      fileName = `image.${ext}`;
    }

    console.log(`   📤 Uploading to Vendure as: ${fileName}`);

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
    
    // Append file with proper content type
    // form-data accepts: append(field, value, filename, options)
    const fileBuffer = Buffer.from(buffer);
    formData.append('0', fileBuffer, fileName, {
      contentType: contentType
    });

    // Upload
    console.log(`   🚀 Uploading to Vendure API...`);
    const uploadRes = await fetch(ADMIN_API, {
      method: 'POST',
      headers: {
        'cookie': cookie,
        ...formData.getHeaders() // Include Content-Type with boundary
      },
      body: formData
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      throw new Error(`Upload failed: HTTP ${uploadRes.status} - ${errorText}`);
    }

    const result = await uploadRes.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    const assetId = result?.data?.createAssets?.[0]?.id;
    if (assetId) {
      console.log(`   ✅ Image uploaded successfully (Asset ID: ${assetId})`);
    } else {
      throw new Error('No asset ID returned from API');
    }

    return assetId;
  } catch (error) {
    console.error(`   ⚠️  Failed to upload image ${imageUrl}: ${error.message}`);
    if (error.stack) {
      console.error(`   Stack: ${error.stack}`);
    }
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
        const price = 0; // Precio fijo en 0
        const variantInput = [{
          productId: productId,
          sku: row.sku || row.slug,
          price: price,
          stockOnHand: 100, // Stock fijo en 100
          translations: [
            {
              languageCode: DEFAULT_LANGUAGE,
              name: row.name
            }
          ]
        }];

        console.log(`💰 Creating variant (Price: $0.00, Stock: 100)...`);
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
            console.log(`📸 Processing ${imageUrls.length} images...`);
            const assetIds = [];
            let successCount = 0;
            let failureCount = 0;
            
            for (let idx = 0; idx < imageUrls.length; idx++) {
              const url = imageUrls[idx];
              console.log(`   [${idx + 1}/${imageUrls.length}] Processing image...`);
              const assetId = await uploadImageFromUrl(url, cookie);
              if (assetId) {
                assetIds.push(assetId);
                successCount++;
              } else {
                failureCount++;
              }
            }

            if (assetIds.length > 0) {
              console.log(`   🔗 Linking ${assetIds.length} images to product...`);
              await client.request(UPDATE_PRODUCT_ASSETS, {
                productId: productId,
                assetIds: assetIds,
                featuredAssetId: assetIds[0] // Primera imagen como destacada
              });
              console.log(`✅ Images linked: ${successCount} successful, ${failureCount} failed (featured: first image)`);
            } else {
              console.log(`   ⚠️  No images were successfully uploaded (${failureCount} failed)`);
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
