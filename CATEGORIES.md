# 🏷️ Sistema de Categorías en Vendure

## Conceptos Clave

### Facets & FacetValues

**Facets** son agrupaciones de valores que se usan para categorizar y filtrar productos. Piensa en ellos como "dimensiones" o "propiedades".

**FacetValues** son los valores específicos dentro de cada Facet.

#### Ejemplo:
```
Facet: "Category"
  ├─ FacetValue: "Living Room"
  ├─ FacetValue: "Bedroom"
  ├─ FacetValue: "Dining"
  └─ FacetValue: "Office"

Facet: "Material"
  ├─ FacetValue: "Wood"
  ├─ FacetValue: "Metal"
  └─ FacetValue: "Fabric"
```

#### Facets Públicos vs Privados

- **Público** (`isPrivate: false`): Visible en Shop API, utilizable en filtros de búsqueda del storefront
- **Privado** (`isPrivate: true`): Solo visible en Admin UI, útil para organización interna

**El importador crea el Facet "category" como público** para que puedas usarlo en filtros de búsqueda en tu tienda.

### Collections

**Collections** son agrupaciones dinámicas de productos basadas en filtros. A diferencia de categorías estáticas, las Collections se **auto-pueblan** según las reglas que definas.

#### Características:
- Se definen mediante **filtros** (filters)
- Se actualizan automáticamente cuando cambias productos
- Pueden ser **jerárquicas** (parent/child)
- Soportan **herencia de filtros** (inheritFilters)

#### Filtros disponibles:
1. **facet-value-filter**: Incluye productos con ciertos FacetValues
2. **variant-name-filter**: Filtra por nombre de variante
3. **product-id-filter**: Incluye productos por ID
4. Otros filtros personalizables (plugins)

**El importador usa `facet-value-filter`** para vincular cada Collection a su categoría correspondiente.

## Flujo en el Importador

### 1. Lectura de Categorías

El scraper extrae categorías de WooCommerce y las guarda en el Excel:

```excel
| title         | categories                  |
|---------------|----------------------------|
| Modern Sofa   | Living Room|Sofas|Modern  |
| King Bed      | Bedroom|Beds              |
```

### 2. Creación de FacetValues

Para cada categoría en `categories`, el importador:

```javascript
// 1. Asegura que existe el Facet "category"
const facetId = await ensureCategoryFacet(client);

// 2. Por cada categoría (ej: "Living Room")
const fvId = await ensureCategoryFacetValue(client, "Living Room");
// → Crea FacetValue con code: "living-room", name: "Living Room"
```

### 3. Asignación a Productos

```javascript
// Asigna todos los FacetValues al producto
await client.request(ASSIGN_FACETS_TO_PRODUCT, {
  productId: product.id,
  facetValueIds: [fvId1, fvId2, fvId3]
});
```

### 4. Creación de Collections

```javascript
await ensureCategoryCollection(client, "Living Room", facetValueId, null);
```

Esto crea una Collection con:
- **slug**: `living-room`
- **name**: `Living Room`
- **filter**: `facet-value-filter` con `facetValueIds: [facetValueId]`

### Resultado

La Collection "Living Room" automáticamente incluye todos los productos que tengan el FacetValue "living-room" asignado.

## Collections Jerárquicas

Puedes crear jerarquías de categorías usando `parentId` y `inheritFilters`:

### Ejemplo Manual

```javascript
// Collection padre: "Living Room"
const parentId = await ensureCategoryCollection(
  client, 
  "Living Room", 
  livingRoomFacetValueId, 
  null
);

// Collection hija: "Sofas" (dentro de Living Room)
await ensureCategoryCollection(
  client, 
  "Sofas", 
  sofasFacetValueId, 
  parentId  // ← pasa el ID del padre
);
```

Con `inheritFilters: true`, la Collection "Sofas" heredará los filtros de "Living Room" **y** aplicará los suyos propios.

### Implementación Automática

Para implementar jerarquías automáticas, podrías modificar `ensureCategoryCollection`:

```javascript
async function ensureCategoryCollection(client, categoryName, facetValueId, parent = null) {
  // Detectar jerarquía por convención de nombres
  // Ej: "Living Room > Sofas" → split por ">"
  const parts = categoryName.split('>').map(s => s.trim());
  
  if (parts.length > 1) {
    // Es una categoría anidada
    const parentName = parts[0];
    const childName = parts[1];
    
    // Crear padre (si no existe)
    const parentFvId = await ensureCategoryFacetValue(client, parentName);
    const parentCollectionId = await ensureCategoryCollection(
      client, parentName, parentFvId, null
    );
    
    // Crear hija con herencia
    return await ensureCategoryCollection(
      client, childName, facetValueId, parentCollectionId
    );
  }
  
  // ... resto del código actual
}
```

## Verificación en Admin UI

### Ver Facets & FacetValues

1. Admin UI → **Catalog** → **Facets**
2. Busca el Facet "Category"
3. Verás todos los FacetValues creados (Living Room, Bedroom, etc.)

### Ver Collections

1. Admin UI → **Catalog** → **Collections**
2. Selecciona una Collection (ej: "Living Room")
3. En la pestaña **"Filters"** verás:
   ```
   facet-value-filter
   facetValueIds: ["living-room-id"]
   ```
4. En la pestaña **"Products"** verás todos los productos que matchean el filtro

### Ver FacetValues de un Producto

1. Admin UI → **Catalog** → **Products**
2. Selecciona un producto
3. Pestaña **"Facets"** → verás los FacetValues asignados

## Consultas GraphQL Útiles

### Ver todas las Collections

```graphql
query GetCollections {
  collections {
    items {
      id
      slug
      name
      parent { name }
      filters {
        code
        args { name value }
      }
      productVariants {
        totalItems
      }
    }
  }
}
```

### Ver productos de una Collection

```graphql
query GetCollectionProducts($slug: String!) {
  collection(slug: $slug) {
    name
    productVariants {
      items {
        name
        product { name }
      }
    }
  }
}
```

### Ver FacetValues de un producto

```graphql
query GetProductFacets($id: ID!) {
  product(id: $id) {
    name
    facetValues {
      facet { name }
      name
      code
    }
  }
}
```

## Búsqueda e Indexación

Si usas el plugin de búsqueda de Vendure (DefaultSearchPlugin, ElasticsearchPlugin, etc.), las Collections y Facets se usan para filtros de búsqueda.

### Actualizar índice después del import

Si tienes `bufferUpdates` habilitado en tu plugin de búsqueda:

```typescript
// En tu código de Vendure
await ctx.service(SearchService).runPendingSearchIndexUpdates();
```

O desde el Admin UI:
1. **Settings** → **Search Index**
2. Botón **"Rebuild search index"**

## Shop API: Filtrado por Categorías

Una vez configurado, tu storefront puede filtrar productos así:

```graphql
query SearchProducts {
  search(input: {
    facetValueFilters: [
      { and: "living-room" }
    ]
  }) {
    items {
      productName
      slug
      price { ... }
    }
  }
}
```

O usar Collections directamente:

```graphql
query GetCollectionProducts {
  collection(slug: "living-room") {
    name
    productVariants {
      items {
        name
        sku
        price
      }
    }
  }
}
```

## Resumen

| Concepto | Descripción | Ejemplo |
|----------|-------------|---------|
| **Facet** | Agrupación de valores | "Category" |
| **FacetValue** | Valor específico | "Living Room" |
| **Collection** | Agrupación dinámica de productos | Collection "Living Room" con filtro por FacetValue |
| **Filter** | Regla que define qué productos incluir | `facet-value-filter` |
| **Público/Privado** | Visibilidad del Facet | `isPrivate: false` |
| **Jerarquía** | Parent/child Collections | "Living Room" → "Sofas" |
| **Herencia** | Child hereda filtros del parent | `inheritFilters: true` |

## Referencias

- [Vendure Docs: Facets](https://docs.vendure.io/guides/developer-guide/facets/)
- [Vendure Docs: Collections](https://docs.vendure.io/guides/developer-guide/collections/)
- [Vendure Docs: Search & Filtering](https://docs.vendure.io/guides/developer-guide/searching/)
- [Admin API Reference](https://docs.vendure.io/reference/admin-api/)

