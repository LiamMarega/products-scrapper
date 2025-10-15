// import-products.js (ESM) - FIXED VERSION
// Requisitos: npm i xlsx graphql-request cross-fetch slugify form-data
// Node 18+ recomendado.

import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { GraphQLClient } from 'graphql-request';
import fetch from 'cross-fetch';
import FormData from 'form-data';
import slugify from 'slugify';

// -------------------- Config --------------------
const ADMIN_API = process.env.ADMIN_API || 'http://localhost:3000/admin-api';
const ADMIN_USER = process.env.ADMIN_USER || 'superadmin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'superadmin';

// Ruta XLSX por defecto
const XLSX_PATH = process.env.XLSX_PATH || path.resolve(process.cwd(), 'living-room.xlsx');

// Canal de Vendure (null = default channel)
const VENDURE_CHANNEL = process.env.VENDURE_CHANNEL || null;

// Stock por defecto
const DEFAULT_STOCK_ON_HAND = Number(process.env.DEFAULT_STOCK_ON_HAND || 100);

// Idioma por defecto
const DEFAULT_LANGUAGE = 'es';

// -------------------- Utils --------------------
function toSlug(name) {
  return slugify(String(name || ''), { lower: true, strict: true });
}

// Helper para convertir boolean a GlobalFlag enum
function toGlobalFlag(val) {
  if (val === true) return 'TRUE';
  if (val === false) return 'FALSE';
  return 'INHERIT';
}

// Helper para reintentos con backoff exponencial
async function withRetry(fn, { retries = 3, baseMs = 300 } = {}) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try { 
      return await fn(); 
    } 
    catch (e) {
      lastErr = e;
      const msg = e?.response?.errors?.[0]?.message || e.message || String(e);
      // reintentar sólo para lock/errores transitorios
      if (!/database is locked|SQLITE_BUSY|timeout/i.test(msg)) throw e;
      const wait = baseMs * Math.pow(2, i);
      await new Promise(r => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

function parsePriceToCents(val) {
  if (val == null || val === '') return 0;
  
  // Eliminar símbolos de moneda y espacios
  let s = String(val)
    .replace(/[$€£¥]/g, '')
    .replace(/\s/g, '')
    .trim();
  
  // Si tiene formato con coma como decimal (ej: 1.234,56)
  if (s.match(/\.\d{3},\d{2}$/)) {
    s = s.replace(/\./g, '').replace(',', '.');
  }
  // Si tiene formato con coma como miles (ej: 1,234.56)
  else if (s.match(/,\d{3}\./)) {
    s = s.replace(/,/g, '');
  }
  // Si solo tiene coma, asumimos que es decimal
  else {
    s = s.replace(',', '.');
  }
  
  const n = Number(s);
  if (!isFinite(n) || n < 0) return 0;
  
  // Vendure usa centavos
  return Math.round(n * 100);
}

function splitImageList(str) {
  if (!str) return [];
  return String(str)
    .split(/[|,]/)
    .map(s => s.trim())
    .filter(Boolean);
}

function guessFilenameFromUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    const base = path.basename(u.pathname);
    return base || 'image.jpg';
  } catch {
    return 'image.jpg';
  }
}

// -------------------- GraphQL Helpers --------------------
async function login() {
  const LOGIN = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        __typename
        ... on CurrentUser { 
          id 
          identifier 
        }
        ... on ErrorResult { 
          message 
          errorCode 
        }
      }
    }
  `;

  let res;
  try {
    res = await fetch(ADMIN_API, {
      method: 'POST',
      headers: { 
        'content-type': 'application/json',
      },
      credentials: 'include', // IMPORTANTE: incluir credentials
      body: JSON.stringify({
        query: LOGIN,
        variables: { username: ADMIN_USER, password: ADMIN_PASS },
      }),
    });
  } catch (e) {
    const hint = `No pude conectar a ${ADMIN_API}. ¿El server está corriendo?\nVerificá que la URL sea correcta.`;
    throw new Error(`Conexión fallida: ${e.message}\n${hint}`);
  }

  let data;
  
  try {
    data = await res.json();
  } catch {
    throw new Error(`Respuesta no-JSON desde ${ADMIN_API}. ¿Es el Admin API correcto?`);
  }

  if (data?.errors?.length) {
    const first = data.errors[0];
    throw new Error(`GraphQL error: ${first.message}`);
  }

  const typename = data?.data?.login?.__typename;
  if (typename !== 'CurrentUser') {
    const msg = data?.data?.login?.message || 'Login fallido';
    const code = data?.data?.login?.errorCode || 'UNKNOWN';
    throw new Error(`Login fallido [${code}]: ${msg}`);
  }

  // Extraer TODAS las cookies del header
  const rawCookies = res.headers.raw()['set-cookie'];
  console.log('DEBUG - Cookies recibidas:', rawCookies ? rawCookies.length : 0);
  
  if (!rawCookies || rawCookies.length === 0) {
    throw new Error('No llegó cookie de sesión. Revisá la configuración del servidor.');
  }

  // Combinar todas las cookies en un string
  const allCookies = rawCookies
    .map(cookie => cookie.split(';')[0].trim())
    .filter(Boolean)
    .join('; ');
    
  if (!allCookies) {
    throw new Error('No se pudieron extraer las cookies de sesión.');
  }

  console.log('✓ Cookie de sesión obtenida');
  return allCookies;
}

async function whoAmI(cookie) {
  const headers = VENDURE_CHANNEL
    ? { cookie, 'vendure-token': VENDURE_CHANNEL }
    : { cookie };

  const client = new GraphQLClient(ADMIN_API, { fetch, headers });
  
  const ME = `
    query Me {
      me {
        id
        identifier
        channels { code token }
      }
    }
  `;
  
  const resp = await client.request(ME);
  return resp?.me;
}

function authedClient(cookie) {
  const headers = VENDURE_CHANNEL
    ? { cookie, 'vendure-token': VENDURE_CHANNEL }
    : { cookie };
  return new GraphQLClient(ADMIN_API, { fetch, headers });
}

// -------------------- Facet & Collection Helpers --------------------
// Cache en memoria por ejecución
const categoryFacetCache = { facetId: null, valueByCode: new Map() };
const collectionCache = new Map(); // "parentId::slug" -> id (para jerarquías)

function toCode(str) {
  return String(str).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
}

// Asegura Facet "category" (público) y devuelve su id
async function ensureCategoryFacet(client) {
  if (categoryFacetCache.facetId) return categoryFacetCache.facetId;

  const existing = await client.request(GET_FACET_BY_CODE, { code: 'category' });
  const found = existing?.facets?.items?.[0];
  if (found?.id) {
    categoryFacetCache.facetId = found.id;
    for (const v of (found.values || [])) categoryFacetCache.valueByCode.set(v.code, v.id);
    return found.id;
  }

  const res = await client.request(CREATE_FACET, {
    input: {
      code: 'category',
      isPrivate: false,            // público → usable en Shop API & filtros
      translations: [{ languageCode: DEFAULT_LANGUAGE, name: 'Category' }]
    }
  });
  categoryFacetCache.facetId = res.createFacet.id;
  return categoryFacetCache.facetId;
}

// Crea/obtiene FacetValue del facet "category"
async function ensureCategoryFacetValue(client, name) {
  const code = toCode(name);
  if (categoryFacetCache.valueByCode.has(code)) {
    return categoryFacetCache.valueByCode.get(code);
  }
  const facetId = await ensureCategoryFacet(client);
  const res = await client.request(CREATE_FACET_VALUE, {
    input: {
      facetId,
      code,
      translations: [{ languageCode: DEFAULT_LANGUAGE, name }]
    }
  });
  const id = res?.createFacetValue?.id;
  if (id) categoryFacetCache.valueByCode.set(code, id);
  return id;
}

// Asegura Collection (filtro por facetValueIds del facet "category")
async function ensureCategoryCollection(client, categoryName, facetValueId, parent = null) {
  const slug = toCode(categoryName);
  
  // Cache key único por slug + parentId para soportar jerarquías
  const cacheKey = parent ? `${parent}::${slug}` : slug;
  
  if (collectionCache.has(cacheKey)) {
    return collectionCache.get(cacheKey);
  }

  // Buscar colección existente por slug
  const found = await client.request(GET_COLLECTION_BY_SLUG, { slug });
  if (found?.collection?.id) {
    collectionCache.set(cacheKey, found.collection.id);
    return found.collection.id;
  }

  // Crear nueva colección
  const input = {
    isPrivate: false,
    translations: [{ 
      languageCode: DEFAULT_LANGUAGE, 
      name: categoryName,
      slug: slug,
      description: categoryName  // Requerido por Vendure
    }],
    parentId: parent || undefined,
    inheritFilters: !!parent,   // heredar si es hija
    filters: [
      {
        code: 'facet-value-filter', // filtro por FacetValue (código por defecto)
        arguments: [{ name: 'facetValueIds', value: JSON.stringify([facetValueId]) }]
      }
    ],
  };

  console.log(`  → Creando colección: ${categoryName}${parent ? ' (hijo)' : ' (raíz)'}`);
  const res = await withRetry(() => client.request(CREATE_COLLECTION, { input }));
  const id = res?.createCollection?.id;
  
  if (id) {
    collectionCache.set(cacheKey, id);
    console.log(`    ✓ Colección creada: ${categoryName} (ID: ${id})`);
  }
  
  return id;
}

// Asegura jerarquía completa de colecciones (Living Room|Sectional|Stationary)
// Retorna: { collectionIds: [...], facetValueIds: [...] }
async function ensureCategoryHierarchy(client, categoryPath) {
  if (!categoryPath) return { collectionIds: [], facetValueIds: [] };
  
  const categories = categoryPath.split('|').map(s => s.trim()).filter(Boolean);
  if (categories.length === 0) return { collectionIds: [], facetValueIds: [] };
  
  console.log(`  → Procesando jerarquía: ${categories.join(' → ')}`);
  
  const collectionIds = [];
  const facetValueIds = [];
  let parentId = null;
  
  // Crear cada nivel de la jerarquía
  for (let i = 0; i < categories.length; i++) {
    const categoryName = categories[i];
    
    // 1. Asegurar FacetValue
    const facetValueId = await ensureCategoryFacetValue(client, categoryName);
    if (facetValueId) {
      facetValueIds.push(facetValueId);
    }
    
    // 2. Asegurar Collection (con parentId del nivel anterior)
    if (facetValueId) {
      const collectionId = await ensureCategoryCollection(client, categoryName, facetValueId, parentId);
      if (collectionId) {
        collectionIds.push(collectionId);
        parentId = collectionId; // El siguiente nivel será hijo de este
      }
    }
  }
  
  console.log(`    ✓ ${collectionIds.length} colección(es) jerárquica(s) asegurada(s)`);
  return { collectionIds, facetValueIds };
}

// Normaliza atributos de variantes (attribute_pa_size → size)
function normAttrKey(k) {
  return String(k)
    .replace(/^attribute_pa_/i, '')
    .replace(/^attribute_/i, '')
    .trim()
    .toLowerCase();
}

async function uploadAssetFromUrl(cookie, urlStr) {
  if (!urlStr) return null;
  
  console.log(`  → Subiendo imagen: ${urlStr.substring(0, 60)}...`);
  
  try {
    // Descargar imagen
    const fileRes = await fetch(urlStr, { timeout: 10000 });
    if (!fileRes.ok) {
      console.warn(`  ⚠ No se pudo descargar (${fileRes.status})`);
      return null;
    }
    
    const buf = Buffer.from(await fileRes.arrayBuffer());
    const filename = guessFilenameFromUrl(urlStr);

    // Preparar mutation GraphQL con file upload
    const operations = JSON.stringify({
      query: `
        mutation CreateAssets($input: [CreateAssetInput!]!) {
          createAssets(input: $input) {
            ... on Asset {
              id
              source
              preview
            }
          }
        }
      `,
      variables: { 
        input: [{ 
          file: null,
          tags: []
        }] 
      },
    });
    
    const map = JSON.stringify({ 
      '0': ['variables.input.0.file'] 
    });

    const form = new FormData();
    form.append('operations', operations);
    form.append('map', map);
    form.append('0', buf, { filename });

    const headers = VENDURE_CHANNEL
      ? { cookie, 'vendure-token': VENDURE_CHANNEL, ...form.getHeaders() }
      : { cookie, ...form.getHeaders() };

    const res = await fetch(ADMIN_API, {
      method: 'POST',
      headers,
      body: form,
    });
    
    const json = await res.json();
    
    if (json.errors) {
      console.warn(`  ⚠ Error subiendo asset:`, json.errors[0]?.message);
      return null;
    }
    
    const asset = json?.data?.createAssets?.[0];
    if (asset?.id) {
      console.log(`  ✓ Asset creado: ID ${asset.id}`);
    }
    
    return asset;
  } catch (e) {
    console.warn(`  ⚠ Excepción subiendo asset: ${e.message}`);
    return null;
  }
}

// -------------------- OptionGroups & Options para Variantes --------------------
async function ensureOptionGroupsAndOptions(client, productId, variants) {
  // variants = array parseado de row.variants_json
  if (!variants || variants.length === 0) return [];

  const optionGroupMap = new Map(); // key: attribute_pa_size -> { groupId, options: Map }

  // 1) Extraer atributos únicos (ej: attribute_pa_size, attribute_pa_color)
  const attributeKeys = new Set();
  variants.forEach(v => {
    Object.keys(v.attributes || {}).forEach(k => attributeKeys.add(k));
  });

  // 2) Por cada atributo, crear/buscar OptionGroup
  for (const rawAttrKey of attributeKeys) {
    const attrKey = normAttrKey(rawAttrKey);
    const groupCode = attrKey;
    const groupName = groupCode.charAt(0).toUpperCase() + groupCode.slice(1);

    // Buscar si existe
    const FIND_GROUP = `
      query FindGroup($code: String!) {
        productOptionGroups(options: { filter: { code: { eq: $code } } }) {
          items { id code }
        }
      }
    `;
    const findRes = await client.request(FIND_GROUP, { code: groupCode });
    let groupId = findRes?.productOptionGroups?.items?.[0]?.id;

    // Si no existe, crearlo
    if (!groupId) {
      const CREATE_GROUP = `
        mutation CreateGroup($input: CreateProductOptionGroupInput!) {
          createProductOptionGroup(input: $input) {
            id code
          }
        }
      `;
      const createRes = await client.request(CREATE_GROUP, {
        input: {
          code: groupCode,
          translations: [{ languageCode: DEFAULT_LANGUAGE, name: groupName }]
        }
      });
      groupId = createRes?.createProductOptionGroup?.id;
      console.log(`  ✓ OptionGroup creado: ${groupName} (${groupId})`);
    }

    // Vincular grupo al producto
    const ADD_GROUP = `
      mutation AddGroup($productId: ID!, $optionGroupId: ID!) {
        addOptionGroupToProduct(productId: $productId, optionGroupId: $optionGroupId) {
          id
        }
      }
    `;
    await client.request(ADD_GROUP, { productId, optionGroupId: groupId });

    optionGroupMap.set(attrKey, { groupId, options: new Map() });
  }

  // 3) Por cada valor de atributo, crear/buscar Option
  for (const variant of variants) {
    for (const [attrKey, attrValue] of Object.entries(variant.attributes || {})) {
      if (!attrValue) continue;

      const groupData = optionGroupMap.get(attrKey);
      if (!groupData) continue;

      const optionCode = String(attrValue).toLowerCase().replace(/\s+/g, '-');
      const optionName = String(attrValue);

      if (groupData.options.has(optionCode)) continue; // ya existe

      // Buscar
      const FIND_OPTION = `
        query FindOption($groupId: ID!) {
          productOptionGroup(id: $groupId) {
            options { id code }
          }
        }
      `;
      const optRes = await client.request(FIND_OPTION, { groupId: groupData.groupId });
      let optionId = optRes?.productOptionGroup?.options?.find(o => o.code === optionCode)?.id;

      // Crear si falta
      if (!optionId) {
        const CREATE_OPTION = `
          mutation CreateOption($input: CreateProductOptionInput!) {
            createProductOption(input: $input) {
              id code
            }
          }
        `;
        const createRes = await client.request(CREATE_OPTION, {
          input: {
            productOptionGroupId: groupData.groupId,
            code: optionCode,
            translations: [{ languageCode: DEFAULT_LANGUAGE, name: optionName }]
          }
        });
        optionId = createRes?.createProductOption?.id;
        console.log(`    ✓ Option creada: ${optionName} (${optionId})`);
      }

      groupData.options.set(optionCode, optionId);
    }
  }

  return optionGroupMap;
}

// -------------------- Mutations & Queries --------------------
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
      ... on ProductVariant {
        id
        sku
        name
        price
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

// Facets
const GET_FACET_BY_CODE = `
  query GetFacetByCode($code: String!) {
    facets(options:{ filter: { code: { eq: $code } } }) {
      items { id code name values { id code name } }
    }
  }
`;

const CREATE_FACET = `
  mutation CreateFacet($input: CreateFacetInput!) {
    createFacet(input: $input) { id code name values { id code name } }
  }
`;

const CREATE_FACET_VALUE = `
  mutation CreateFacetValue($input: CreateFacetValueInput!) {
    createFacetValue(input: $input) { id code name }
  }
`;

const UPDATE_PRODUCT = `
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      facetValues { id name }
    }
  }
`;

// Collections
const GET_COLLECTION_BY_SLUG = `
  query GetCollection($slug: String) { collection(slug: $slug) { id slug name } }
`;

const CREATE_COLLECTION = `
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) { id slug name }
  }
`;

// Agregar/quitar productos de una colección
const ADD_PRODUCTS_TO_COLLECTION = `
  mutation AddProductsToCollection($collectionId: ID!, $productIds: [ID!]!) {
    addProductsToCollection(collectionId: $collectionId, productIds: $productIds) { id }
  }
`;

const REMOVE_PRODUCTS_FROM_COLLECTION = `
  mutation RemoveProductsFromCollection($collectionId: ID!, $productIds: [ID!]!) {
    removeProductsFromCollection(collectionId: $collectionId, productIds: $productIds) { id }
  }
`;

// -------------------- XLSX Reader --------------------
function readXlsxRows(xlsxPath) {
  if (!fs.existsSync(xlsxPath)) {
    throw new Error(`No existe el archivo XLSX en: ${xlsxPath}`);
  }
  
  const wb = XLSX.readFile(xlsxPath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  
  return rows;
}

// -------------------- Main --------------------
(async () => {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║   VENDURE PRODUCT IMPORTER - Fixed Version               ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  console.log('→ Conectando a Admin API:', ADMIN_API);
  const cookie = await login();

  const me = await whoAmI(cookie);
  if (!me) throw new Error('Usuario no autenticado tras login');
  
  console.log('✓ Autenticado como:', me.identifier);
  console.log('✓ Canal:', me.channels?.[0]?.code || 'default');
  console.log();

  // Cliente autenticado
  const client = authedClient(cookie);

  // Leer XLSX
  console.log('→ Leyendo archivo XLSX:', XLSX_PATH);
  const rows = readXlsxRows(XLSX_PATH);
  console.log(`✓ Se encontraron ${rows.length} filas\n`);

  let ok = 0, fail = 0, skipped = 0;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // +2 porque la fila 1 es el header

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Procesando [${i + 1}/${rows.length}] - Fila ${rowNum}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    try {
      // Validar nombre
      const name = String(row.title || '').trim();
      if (!name) {
        console.warn(`⊘ Sin "title", se salta esta fila\n`);
        skipped++;
        continue;
      }

      console.log(`Producto: ${name}`);

      // Generar slug (usar del Excel si existe)
      const slug = (row.slug && String(row.slug).trim()) || toSlug(name);
      
      // Descripción (combinar larga + corta)
      const description = String(row.description_html || row.description_text || '').trim();
      const shortDesc = String(row.short_description_text || '').trim();
      const fullDesc = description + (shortDesc ? `\n\n${shortDesc}` : '');

      // ========== IMÁGENES ==========
      const imageUrls = [
        ...splitImageList(row.images),
        ...splitImageList(row.thumbnail),
      ];
      
      let featuredAssetId = undefined;
      let assetIds = [];
      
      if (imageUrls.length > 0) {
        console.log(`Imágenes encontradas: ${imageUrls.length}`);
        
        // Subir primera imagen como featured
        const firstAsset = await uploadAssetFromUrl(cookie, imageUrls[0]);
        if (firstAsset?.id) {
          featuredAssetId = firstAsset.id;
          assetIds.push(firstAsset.id);
        }
        
        // Subir el resto de imágenes (máximo 5 para no saturar)
        const restImages = imageUrls.slice(1, 5);
        for (const imgUrl of restImages) {
          const asset = await uploadAssetFromUrl(cookie, imgUrl);
          if (asset?.id) {
            assetIds.push(asset.id);
          }
        }
      }

      // ========== CREAR PRODUCTO ==========
      const productInput = {
        enabled: true,
        translations: [
          { 
            languageCode: DEFAULT_LANGUAGE, 
            name, 
            slug, 
            description: fullDesc 
          },
        ],
        ...(featuredAssetId && { featuredAssetId }),
        ...(assetIds.length > 0 && { assetIds }),
      };

      console.log(`→ Creando producto...`);
      const createProductResp = await client.request(CREATE_PRODUCT, {
        input: productInput,
      });
      
      const product = createProductResp?.createProduct;
      if (!product?.id) {
        throw new Error('createProduct no devolvió ID válido');
      }
      
      console.log(`✓ Producto creado: ID ${product.id}, slug: ${product.slug}`);

      // ========== CATEGORÍAS (Facets & Collections) ==========
      const categoriesRaw = String(row.categories || '').trim();
      if (categoriesRaw) {
        console.log(`→ Procesando categorías: ${categoriesRaw}`);
        
        // 1) Crear jerarquía de colecciones y obtener FacetValues
        const { collectionIds, facetValueIds } = await ensureCategoryHierarchy(client, categoriesRaw);
        
        // 2) Asignar FacetValues al producto usando updateProduct
        if (facetValueIds.length > 0) {
          try {
            await withRetry(() => client.request(UPDATE_PRODUCT, {
              input: {
                id: product.id,
                facetValueIds
              }
            }));
            console.log(`  ✓ ${facetValueIds.length} FacetValue(s) asignados al producto`);
          } catch (e) {
            const gErr = e?.response?.errors?.[0];
            const extra = gErr ? ` | GraphQL: ${gErr.message}` : '';
            console.warn(`  ⚠ Error asignando FacetValues: ${e.message}${extra}`);
          }
        }
        
        // 3) Vincular explícitamente el producto a TODAS las colecciones de la jerarquía
        if (collectionIds.length > 0) {
          console.log(`  → Vinculando producto a ${collectionIds.length} colección(es)...`);
          
          let linkedCount = 0;
          for (const collectionId of collectionIds) {
            try {
              await withRetry(() => client.request(ADD_PRODUCTS_TO_COLLECTION, {
                collectionId,
                productIds: [product.id]
              }));
              linkedCount++;
            } catch (e) {
              const gErr = e?.response?.errors?.[0];
              const extra = gErr ? ` | GraphQL: ${gErr.message}` : '';
              console.warn(`    ⚠ Error vinculando a colección ${collectionId}: ${e.message}${extra}`);
            }
          }
          
          console.log(`  ✓ Producto vinculado exitosamente a ${linkedCount} colección(es)`);
        }
      }

      // ========== CREAR VARIANTE(S) ==========
      let variantInput = [];
      
      // Verificar si hay variantes (producto variable de WooCommerce)
      if (row.variants_json) {
        try {
          const variants = JSON.parse(row.variants_json);
          
          if (variants && variants.length > 1) {
            console.log(`→ Producto con ${variants.length} variantes, creando opciones...`);
            
            // Crear OptionGroups y Options
            const optionMap = await ensureOptionGroupsAndOptions(client, product.id, variants);
            
            // Construir variantes con optionIds
            for (const v of variants) {
              const optionIds = [];
              
              // Mapear atributos a optionIds (normalizar claves)
              for (const [rawKey, attrValue] of Object.entries(v.attributes || {})) {
                const attrKey = normAttrKey(rawKey);
                const groupData = optionMap.get(attrKey);
                if (groupData) {
                  const optionCode = String(attrValue).toLowerCase().replace(/\s+/g, '-');
                  const optionId = groupData.options.get(optionCode);
                  if (optionId) optionIds.push(optionId);
                }
              }
              
              // Nombre de la variante con atributos
              const variantName = Object.values(v.attributes || {}).join(' - ');
              const variantSku = v.sku || `${row.sku || row.product_id || slug}-${v.variation_id}`;
            const variantPrice = v.display_price != null && v.display_price !== ''
  ? parsePriceToCents(v.display_price)
  : parsePriceToCents(row.price);
              
              // Subir imagen de variante si existe
              let variantAssetId = featuredAssetId;
              if (v.image && v.image !== imageUrls[0]) {
                const variantAsset = await uploadAssetFromUrl(cookie, v.image);
                if (variantAsset?.id) {
                  variantAssetId = variantAsset.id;
                }
              }
              
              variantInput.push({
                productId: product.id,
                sku: variantSku,
                price: variantPrice,
                stockOnHand: v.stock_quantity || DEFAULT_STOCK_ON_HAND,
                trackInventory: toGlobalFlag(v.trackInventory),
                translations: [{ 
                  languageCode: DEFAULT_LANGUAGE, 
                  name: `${name} - ${variantName}` 
                }],
                optionIds,
                ...(variantAssetId && { featuredAssetId: variantAssetId })
              });
            }
            
            console.log(`→ Creando ${variantInput.length} variantes con opciones...`);
          } else {
            // Solo 1 variante, usar flujo simple
            const priceCents = parsePriceToCents(row.price);
            const sku = String(row.sku || row.product_id || slug || `SKU-${Date.now()}`).trim();
            
            variantInput = [{
              productId: product.id,
              sku,
              price: priceCents,
              stockOnHand: DEFAULT_STOCK_ON_HAND,
              trackInventory: toGlobalFlag(),
              translations: [{ languageCode: DEFAULT_LANGUAGE, name }],
              ...(featuredAssetId && { featuredAssetId }),
            }];
            
            console.log(`→ Creando variante (SKU: ${sku}, Precio: $${(priceCents / 100).toFixed(2)})`);
          }
        } catch (e) {
          console.warn(`  ⚠ Error parseando variants_json: ${e.message}, usando flujo simple`);
          // Caer al flujo simple
          const priceCents = parsePriceToCents(row.price);
          const sku = String(row.sku || row.product_id || slug || `SKU-${Date.now()}`).trim();
          
          variantInput = [{
            productId: product.id,
            sku,
            price: priceCents,
            stockOnHand: DEFAULT_STOCK_ON_HAND,
            trackInventory: toGlobalFlag(),
            translations: [{ languageCode: DEFAULT_LANGUAGE, name }],
            ...(featuredAssetId && { featuredAssetId }),
          }];
          
          console.log(`→ Creando variante (SKU: ${sku}, Precio: $${(priceCents / 100).toFixed(2)})`);
        }
      } else {
        // Sin variantes, flujo simple (producto simple)
        const priceCents = parsePriceToCents(row.price);
        const sku = String(row.sku || row.product_id || slug || `SKU-${Date.now()}`).trim();
        
        variantInput = [{
          productId: product.id,
          sku,
          price: priceCents,
          stockOnHand: DEFAULT_STOCK_ON_HAND,
          trackInventory: toGlobalFlag(),
          translations: [{ languageCode: DEFAULT_LANGUAGE, name }],
          ...(featuredAssetId && { featuredAssetId }),
        }];
        
        console.log(`→ Creando variante (SKU: ${sku}, Precio: $${(priceCents / 100).toFixed(2)})`);
      }

      // Ejecutar createProductVariants
      const variantResp = await client.request(CREATE_PRODUCT_VARIANTS, { 
        input: variantInput 
      });
      
      const createdVariants = variantResp?.createProductVariants || [];
      
      // Verificar errores
      for (const variant of createdVariants) {
        if (variant?.errorCode) {
          throw new Error(`Error creando variante: ${variant.message}`);
        }
        if (!variant?.id) {
          throw new Error('createProductVariants no devolvió ID válido');
        }
      }
      
      console.log(`✓ ${createdVariants.length} variante(s) creada(s)`);

      ok++;
      console.log(`✅ ÉXITO: Producto "${name}" importado correctamente\n`);

    } catch (e) {
      fail++;
      console.error(`❌ ERROR en fila ${rowNum}:`, e.message);
      console.error('Detalles:', e.stack ? e.stack.split('\n')[1] : '');
      console.log();
    }
  }

  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                   RESUMEN FINAL                           ║');
  console.log('╠═══════════════════════════════════════════════════════════╣');
  console.log(`║  ✅ Productos exitosos : ${ok.toString().padStart(3)}                         ║`);
  console.log(`║  ❌ Errores            : ${fail.toString().padStart(3)}                         ║`);
  console.log(`║  ⊘  Saltados           : ${skipped.toString().padStart(3)}                         ║`);
  console.log(`║  📊 Total filas        : ${rows.length.toString().padStart(3)}                         ║`);
  console.log('╚═══════════════════════════════════════════════════════════╝');
  
  if (ok > 0) {
    console.log(`\n🎉 ¡Import completado! Revisá tus productos en:`);
    console.log(`   ${ADMIN_API.replace('/admin-api', '/admin')}`);
  }

})().catch(err => {
  console.error('\n💥 ERROR FATAL:', err.message);
  console.error(err.stack);
  process.exit(1);
});