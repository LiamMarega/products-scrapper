# 🛒 WooCommerce to Vendure Product Pipeline

Pipeline completo para scrapear productos de WooCommerce e importarlos a Vendure con soporte completo de variantes.

## 🚀 Quick Start

### 1. Scrapear productos de WooCommerce

```bash
node scraper.js \
  --startUrl="https://todaysfurniture305.com/product-category/bedroom/" \
  --out="bedroom.xlsx" \
  --jsonOut="bedroom.json" \
  --concurrency=3 \
  --maxPages=5
```

**Opciones:**
- `--startUrl`: URL de la categoría a scrapear (requerido)
- `--out`: Archivo Excel de salida (default: `scrape.xlsx`)
- `--jsonOut`: Archivo JSON opcional para debugging
- `--concurrency`: Páginas a scrapear en paralelo (default: 2)
- `--maxPages`: Máximo de páginas a scrapear (default: todas)
- `--delayMs`: Delay base entre requests (default: 400ms)
- `--headless`: Modo headless (default: `true`)

### 2. Importar a Vendure

```bash
# Configurar variables de entorno
export ADMIN_API="http://localhost:3000/admin-api"
export ADMIN_USER="superadmin"
export ADMIN_PASS="superadmin"
export XLSX_PATH="$(pwd)/bedroom.xlsx"
export DEFAULT_STOCK_ON_HAND=50

# Ejecutar importación
node import-products.js
```

**Variables de entorno:**
- `ADMIN_API`: URL del Admin API de Vendure (default: `http://127.0.0.1:3000/admin-api`)
- `ADMIN_USER`: Usuario admin (default: `superadmin`)
- `ADMIN_PASS`: Password admin (default: `superadmin`)
- `XLSX_PATH`: Ruta al archivo Excel (default: `./living-room.xlsx`)
- `DEFAULT_STOCK_ON_HAND`: Stock por defecto (default: 100)
- `VENDURE_CHANNEL`: Token del canal (opcional, para multi-canal)

## 📦 Características

### Scraper (scraper.js)
- ✅ Extrae título, descripciones (larga + corta), slug, SKU
- ✅ Maneja precios ocultos ("Please register to see price")
- ✅ Descarga todas las imágenes (srcset, lazy-loading)
- ✅ Soporte completo para productos variables de WooCommerce
- ✅ Extrae atributos de variantes (color, talla, etc.)
- ✅ Dimensiones, categorías, tags, descuentos
- ✅ Reintentos automáticos y manejo de errores
- ✅ Exporta a Excel + JSON

### Importador (import-products.js)
- ✅ Login robusto con manejo de cookies múltiples
- ✅ Sube imágenes con multipart (operaciones + map)
- ✅ Crea productos con metadata completa
- ✅ **Soporte automático de variantes**:
  - Crea OptionGroups (Size, Color, etc.)
  - Crea Options (S, M, L, Black, White, etc.)
  - Vincula opciones a productos
  - Crea ProductVariants con combinaciones correctas
  - Normaliza atributos de WooCommerce (attribute_pa_size → size)
- ✅ Maneja SKUs, precios y stock por variante
- ✅ Sube imágenes individuales por variante
- ✅ Fallback a producto simple si no hay variantes
- ✅ **Categorías y taxonomía**:
  - Crea Facet "category" público automáticamente
  - Genera FacetValues por cada categoría del Excel
  - Asigna FacetValues a productos
  - Crea Collections con filtros dinámicos (facet-value-filter)
  - Soporte para jerarquías (parentId, inheritFilters)

## 🎯 Flujo de Trabajo

### Para productos simples (sin variantes):
1. Scraper extrae: `title`, `slug`, `sku`, `price`, `images`, `descriptions`
2. Importador crea:
   - 1 Product
   - 1 ProductVariant con el precio y SKU

### Para productos variables (con variantes):
1. Scraper extrae todo lo anterior + `variants_json` con:
   - `attributes`: `{ attribute_pa_color: "black", attribute_pa_size: "large" }`
   - `sku`, `price`, `image` por variante
   - `stock_quantity`

2. Importador detecta `variants_json` y:
   - Crea/busca OptionGroups (Color, Size)
   - Crea/busca Options (Black, Large)
   - Vincula grupos al producto
   - Crea N ProductVariants, cada una con:
     - SKU único
     - Precio específico
     - Stock específico
     - Imagen específica (si difiere)
     - optionIds correctos

## 🏷️ Sistema de Categorías

El importador implementa el sistema de categorías de Vendure usando **Facets** y **Collections**:

### Facets & FacetValues
- **Facet**: Agrupación de valores (ej: "category")
- **FacetValue**: Valor específico (ej: "Living Room", "Bedroom")
- Los Facets pueden ser públicos (visibles en Shop API y filtrables) o privados (solo Admin)
- El importador crea automáticamente el Facet "category" como público

### Collections
- Agrupaciones dinámicas de productos basadas en filtros
- Se auto-pueblan según las reglas definidas (ej: "incluye productos con FacetValue 'Living Room'")
- Soportan jerarquías (parent/child) con herencia de filtros
- El importador usa `facet-value-filter` para vincular cada Collection a su FacetValue

### Flujo de categorías
1. **Scraper** extrae categorías de WooCommerce → columna `categories` (separadas por `|`)
2. **Importador** lee `categories` y:
   - Crea FacetValues en el Facet "category" (si no existen)
   - Asigna esos FacetValues al producto
   - Crea Collections con filtros que apuntan a esos FacetValues
3. **Vendure** auto-puebla las Collections según los filtros definidos

### Ejemplo
```
Product: "Modern Sofa"
categories: "Living Room|Sofas|Modern"
```
→ Crea 3 FacetValues: `living-room`, `sofas`, `modern`  
→ Asigna esos 3 FacetValues al producto  
→ Crea 3 Collections con filtros correspondientes  
→ El producto aparece automáticamente en las 3 colecciones

## 📊 Estructura del Excel

| Columna | Descripción |
|---------|-------------|
| `title` | Nombre del producto |
| `slug` | URL slug (auto si falta) |
| `sku` | SKU base del producto |
| `description_text` | Descripción larga (texto plano) |
| `description_html` | Descripción larga (HTML) |
| `short_description_text` | Descripción corta (texto) |
| `short_description_html` | Descripción corta (HTML) |
| `price` | Precio (si visible) |
| `price_hidden_requires_login` | TRUE/FALSE |
| `images` | URLs separadas por `\|` |
| `thumbnail` | URL de imagen principal |
| `variants_json` | JSON con variantes de WooCommerce |
| `categories` | Categorías separadas por `\|` |
| `tags_extra` | Tags separadas por `\|` |
| `product_id` | ID original de WooCommerce |
| `product_type` | simple/variable |
| `dimensions_raw` | Dimensiones extraídas |
| `discount_label` | Etiqueta de descuento |
| `countdown` | JSON con countdown data |

## 🔧 Troubleshooting

### "No llegó cookie de sesión"
- Verifica que Vendure esté corriendo en `http://localhost:3000`
- Revisa las credenciales de admin

### "Error subiendo asset"
- Las imágenes muy grandes pueden fallar (timeout)
- El scraper solo sube las primeras 5 imágenes para evitar saturar

### "createProductVariants no devolvió ID válido"
- Puede ser un error de validación (SKU duplicado, precio inválido)
- Revisa los logs para más detalles

### Productos con variantes no se importan correctamente
- Verifica que `variants_json` tenga el formato correcto
- El importador automáticamente cae a modo simple si hay error
- Revisa que los atributos usen el formato estándar de WooCommerce (`attribute_pa_*`)

### Collections vacías o productos no aparecen en categorías
- Las Collections se pueblan automáticamente por los filtros definidos
- Verifica que los FacetValues estén correctamente asignados al producto
- Si usas búsqueda con índice, ejecuta `runPendingSearchIndexUpdates` después del import
- En Admin UI: Catalog → Collections → (selecciona una) → verifica el filtro `facet-value-filter`

## 🎁 Ejemplos

### Scrapear todas las categorías
```bash
# Living Room
node scraper.js \
  --startUrl="https://todaysfurniture305.com/product-category/living-room/" \
  --out="living-room.xlsx"

# Bedroom
node scraper.js \
  --startUrl="https://todaysfurniture305.com/product-category/bedroom/" \
  --out="bedroom.xlsx"

# Dining
node scraper.js \
  --startUrl="https://todaysfurniture305.com/product-category/dining/" \
  --out="dining.xlsx"
```

### Importar todo a Vendure
```bash
for file in living-room.xlsx bedroom.xlsx dining.xlsx; do
  export XLSX_PATH="$(pwd)/$file"
  node import-products.js
done
```

## 📚 Documentación

### Documentación Local
- **[CATEGORIES.md](./CATEGORIES.md)** - Guía completa del sistema de categorías, Facets y Collections
- **[CHANGELOG_CATEGORIES.md](./CHANGELOG_CATEGORIES.md)** - Resumen de cambios implementados para categorías
- **[update-search-index.js](./update-search-index.js)** - Script opcional para actualizar el índice de búsqueda

### Documentación Vendure
- [Products & Variants](https://docs.vendure.io/guides/developer-guide/product-modeling/)
- [Product Options](https://docs.vendure.io/guides/developer-guide/product-modeling/#product-options)
- [Facets](https://docs.vendure.io/guides/developer-guide/facets/)
- [Collections](https://docs.vendure.io/guides/developer-guide/collections/)
- [Admin API](https://docs.vendure.io/reference/admin-api/)
- [Asset Upload](https://docs.vendure.io/guides/developer-guide/uploading-files/)

## 🎨 GraphiQL

Probar queries en: `http://localhost:3000/graphiql/admin`

```graphql
query GetProducts {
  products(options: { take: 10 }) {
    items {
      id
      name
      slug
      variants {
        id
        sku
        price
        options {
          name
          group { name }
        }
      }
    }
  }
}
```

## 📝 Notas

- **Precios ocultos**: Si la tienda WooCommerce requiere login para ver precios, el scraper marca `price_hidden_requires_login: TRUE` y deja `price` vacío. El importador crea el producto con precio 0 y podés actualizarlo después.

- **Imágenes**: El importador sube máximo 5 imágenes por producto para evitar timeouts. Si necesitás más, ajustá `restImages.slice(1, 5)` en `import-products.js`.

- **Variantes**: El sistema automáticamente detecta si un producto es "variable" y crea las OptionGroups/Options necesarias. Si el producto ya existe en Vendure, reutiliza los grupos existentes. Los atributos de WooCommerce (`attribute_pa_size`) se normalizan automáticamente a claves simples (`size`).

- **Stock**: Por defecto usa `DEFAULT_STOCK_ON_HAND`. Si el scraper captura `stock_quantity` de las variantes, usa ese valor.

- **Categorías**: Las categorías del Excel se convierten en FacetValues del Facet "category" (público) y se crean Collections automáticas con filtros dinámicos. Las Collections se pueblan automáticamente según las reglas definidas, por lo que no hace falta asignar productos manualmente.

- **Collections jerárquicas**: Si necesitás jerarquías (ej: "Living Room" → "Sofas"), modificá `ensureCategoryCollection` para detectar patrones en los nombres y pasar `parentId` + `inheritFilters: true`.

## 🛠️ Dependencias

```bash
# Scraper
npm install puppeteer exceljs minimist

# Importador
npm install xlsx graphql-request cross-fetch slugify form-data
```

## ✨ Hecho

Tu pipeline está completo y listo para:
- ✅ Scrapear cualquier tienda WooCommerce
- ✅ Manejar productos simples y variables
- ✅ Importar a Vendure con toda la metadata
- ✅ Crear variantes con opciones correctamente vinculadas
- ✅ Normalizar atributos de WooCommerce automáticamente
- ✅ Subir imágenes y assets
- ✅ Crear taxonomía completa (Facets + Collections)
- ✅ Asignar categorías a productos con FacetValues
- ✅ Collections auto-pobladas con filtros dinámicos
- ✅ Soporte para jerarquías de categorías
- ✅ Manejar errores y reintentos

¡A scrapear! 🚀

