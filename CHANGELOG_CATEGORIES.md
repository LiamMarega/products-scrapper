# 📋 Changelog: Sistema de Categorías

## Cambios Implementados

### ✅ 1. Nuevas Operaciones GraphQL (`import-products.js`)

Se añadieron las siguientes queries y mutations:

#### Facets
- `GET_FACET_BY_CODE`: Buscar Facet por código
- `CREATE_FACET`: Crear nuevo Facet
- `CREATE_FACET_VALUE`: Crear nuevo FacetValue
- `ASSIGN_FACETS_TO_PRODUCT`: Asignar FacetValues a un producto

#### Collections
- `GET_COLLECTION_BY_SLUG`: Buscar Collection por slug
- `CREATE_COLLECTION`: Crear nueva Collection con filtros

### ✅ 2. Helpers para Facets & Collections

Se crearon las siguientes funciones helper:

```javascript
// Cache en memoria para optimización
const categoryFacetCache = { facetId: null, valueByCode: new Map() };
const collectionCache = new Map();

// Normalización
function toCode(str) // Convierte strings a códigos (ej: "Living Room" → "living-room")

// Facets
async function ensureCategoryFacet(client) // Asegura que existe el Facet "category"
async function ensureCategoryFacetValue(client, name) // Crea/obtiene FacetValue

// Collections
async function ensureCategoryCollection(client, categoryName, facetValueId, parent)
// Crea Collection con filtro facet-value-filter

// Variantes
function normAttrKey(k) // Normaliza atributos WooCommerce (attribute_pa_size → size)
```

### ✅ 3. Integración en Flujo de Importación

Se añadió un bloque completo después de crear cada producto:

```javascript
// ========== CATEGORÍAS (Facets & Collections) ==========
const categoriesRaw = String(row.categories || '').trim();
if (categoriesRaw) {
  const categoryList = categoriesRaw.split('|').map(s => s.trim()).filter(Boolean);
  
  // 1) Crear FacetValues y asignarlos al producto
  const facetValueIds = [];
  for (const catName of categoryList) {
    const fvId = await ensureCategoryFacetValue(client, catName);
    if (fvId) facetValueIds.push(fvId);
  }
  
  if (facetValueIds.length) {
    await client.request(ASSIGN_FACETS_TO_PRODUCT, {
      productId: product.id,
      facetValueIds
    });
  }
  
  // 2) Crear Collections con filtros dinámicos
  for (const catName of categoryList) {
    const fvId = await ensureCategoryFacetValue(client, catName);
    await ensureCategoryCollection(client, catName, fvId, null);
  }
}
```

**Ubicación**: Justo después de `console.log('✓ Producto creado: ...')` y antes de `// ========== CREAR VARIANTE(S) ==========`

### ✅ 4. Mejora en Manejo de Variantes

Se mejoró la normalización de atributos de variantes WooCommerce:

#### Antes:
```javascript
const groupCode = attrKey.replace('attribute_pa_', '').replace('attribute_', '');
```

#### Ahora:
```javascript
function normAttrKey(k) {
  return String(k)
    .replace(/^attribute_pa_/i, '')
    .replace(/^attribute_/i, '')
    .trim()
    .toLowerCase();
}

// En ensureOptionGroupsAndOptions:
for (const rawAttrKey of attributeKeys) {
  const attrKey = normAttrKey(rawAttrKey);
  // ...
}

// Al mapear optionIds:
for (const [rawKey, attrValue] of Object.entries(v.attributes || {})) {
  const attrKey = normAttrKey(rawKey);
  // ...
}
```

Esto asegura que variantes con `attribute_pa_size`, `ATTRIBUTE_PA_SIZE`, o `attribute_size` se normalicen correctamente a `size`.

### ✅ 5. Descripción del Producto

Se verificó que la composición de descripciones esté correcta (ya estaba bien implementada):

```javascript
const description = String(row.description_html || row.description_text || '').trim();
const shortDesc = String(row.short_description_text || '').trim();
const fullDesc = description + (shortDesc ? `\n\n${shortDesc}` : '');

const productInput = {
  // ...
  translations: [{
    languageCode: DEFAULT_LANGUAGE,
    name, slug,
    description: fullDesc  // ✓ Descripción completa
  }],
};
```

## Archivos Modificados

### `/import-products.js`
- ✅ Añadidas operaciones GraphQL (líneas ~405-440)
- ✅ Helpers para Facets & Collections (líneas ~188-277)
- ✅ Normalización de atributos de variantes (líneas ~271-277, ~368-371, ~675-677)
- ✅ Bloque de procesamiento de categorías (líneas ~656-686)

### `/README.md`
- ✅ Actualizada sección "Importador" con nuevas características
- ✅ Nueva sección "🏷️ Sistema de Categorías" con explicación completa
- ✅ Actualizada sección "Troubleshooting" con problemas de categorías
- ✅ Actualizadas "Notas" con información de categorías
- ✅ Actualizada sección "✨ Hecho" con nuevas características

### Archivos Nuevos

#### `/CATEGORIES.md`
Documentación completa del sistema de categorías:
- Conceptos de Facets & FacetValues
- Concepto de Collections
- Flujo completo en el importador
- Collections jerárquicas
- Verificación en Admin UI
- Consultas GraphQL útiles
- Integración con búsqueda
- Shop API: filtrado por categorías

#### `/update-search-index.js`
Script opcional para actualizar el índice de búsqueda después del import:
- Login al Admin API
- Ejecuta mutation `reindex`
- Espera a que termine el job
- Muestra progreso y resultado

#### `/CHANGELOG_CATEGORIES.md`
Este archivo con resumen de todos los cambios.

## Uso

### Import Normal
```bash
export XLSX_PATH="$(pwd)/bedroom.xlsx"
node import-products.js
```

El importador ahora:
1. Crea productos con variantes (como antes)
2. **Procesa categorías del Excel**
3. **Crea/busca FacetValues**
4. **Asigna FacetValues a productos**
5. **Crea Collections con filtros**
6. Sube imágenes (como antes)

### Actualizar Índice de Búsqueda (opcional)
```bash
node update-search-index.js
```

Solo necesario si tienes `bufferUpdates: true` en tu plugin de búsqueda.

## Verificación

### En Admin UI

1. **Facets & FacetValues**
   - Catalog → Facets
   - Buscar Facet "Category"
   - Verás todos los valores: Living Room, Bedroom, Dining, etc.

2. **Collections**
   - Catalog → Collections
   - Verás Collections por cada categoría
   - Al abrir una, verás el filtro `facet-value-filter` configurado

3. **Productos**
   - Catalog → Products
   - Abrir un producto
   - Pestaña "Facets" → verás las categorías asignadas

### En GraphQL (Admin API)

```graphql
query VerifyCategories {
  # Ver Facet "category"
  facets(options: { filter: { code: { eq: "category" } } }) {
    items {
      code
      name
      values {
        code
        name
      }
    }
  }
  
  # Ver todas las Collections
  collections {
    items {
      slug
      name
      filters {
        code
        args { name value }
      }
    }
  }
}
```

### En Shop API

```graphql
query SearchByCategory {
  # Buscar productos de "Living Room"
  search(input: {
    facetValueFilters: [{ and: "living-room" }]
  }) {
    items {
      productName
      slug
    }
  }
  
  # O directamente por Collection
  collection(slug: "living-room") {
    name
    productVariants {
      items {
        name
        sku
      }
    }
  }
}
```

## Resultado Esperado

### Excel Input
```
| title       | categories               |
|-------------|-------------------------|
| Modern Sofa | Living Room|Sofas       |
| King Bed    | Bedroom|Beds|King Size  |
```

### Vendure Output

#### Facets
```
Facet: "Category" (público)
  ├─ living-room
  ├─ sofas
  ├─ bedroom
  ├─ beds
  └─ king-size
```

#### Collections
```
Collection: "Living Room" (slug: living-room)
  Filter: facet-value-filter → facetValueIds: ["living-room"]
  
Collection: "Sofas" (slug: sofas)
  Filter: facet-value-filter → facetValueIds: ["sofas"]
  
Collection: "Bedroom" (slug: bedroom)
  Filter: facet-value-filter → facetValueIds: ["bedroom"]
  
Collection: "Beds" (slug: beds)
  Filter: facet-value-filter → facetValueIds: ["beds"]
  
Collection: "King Size" (slug: king-size)
  Filter: facet-value-filter → facetValueIds: ["king-size"]
```

#### Productos
```
Product: "Modern Sofa"
  FacetValues: [living-room, sofas]
  → Aparece en Collections: "Living Room", "Sofas"

Product: "King Bed"
  FacetValues: [bedroom, beds, king-size]
  → Aparece en Collections: "Bedroom", "Beds", "King Size"
```

## Notas Importantes

### Cache en Memoria
El importador usa cache en memoria para optimizar requests:
- Facets se buscan una sola vez
- FacetValues se cachean por código
- Collections se cachean por slug

El cache se resetea al reiniciar el script.

### Idempotencia
Todas las operaciones son idempotentes:
- Si el Facet "category" ya existe, se reutiliza
- Si un FacetValue ya existe, se reutiliza
- Si una Collection ya existe, se reutiliza

Puedes ejecutar el import múltiples veces sin duplicar categorías.

### Performance
Por cada producto con N categorías:
- 1 request para asignar FacetValues al producto
- N requests para asegurar Collections (con cache, 0 si ya existen)

Total: ~1-2 requests extra por producto.

### Collections Auto-pobladas
Las Collections se pueblan automáticamente según sus filtros. No hace falta asignar productos manualmente. Solo necesitas:
1. Asignar FacetValues al producto
2. Crear la Collection con el filtro correcto
3. Vendure se encarga del resto

## Próximos Pasos Opcionales

### 1. Jerarquías de Categorías
Modificar `ensureCategoryCollection` para detectar patrones como "Living Room > Sofas" y crear jerarquías parent/child.

### 2. Más Facets
Añadir más Facets (Material, Color, Brand, etc.) siguiendo el mismo patrón:
```javascript
await ensureMaterialFacet(client);
await ensureMaterialFacetValue(client, "Wood");
// etc.
```

### 3. Filtros Compuestos
Crear Collections con múltiples filtros:
```javascript
filters: [
  {
    code: 'facet-value-filter',
    arguments: [{ 
      name: 'facetValueIds', 
      value: JSON.stringify([livingRoomId, modernId]) 
    }]
  }
]
```

### 4. Plugin Personalizado
Crear plugins de Vendure para filtros customizados (ej: precio, fecha, etc.).

## Referencias

- [CATEGORIES.md](/CATEGORIES.md) - Documentación completa del sistema
- [README.md](/README.md) - Documentación general del pipeline
- [Vendure Docs: Facets](https://docs.vendure.io/guides/developer-guide/facets/)
- [Vendure Docs: Collections](https://docs.vendure.io/guides/developer-guide/collections/)

---

**¡El sistema de categorías está completo y listo para usar!** 🎉

