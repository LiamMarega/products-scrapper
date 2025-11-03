# 🛒 WooCommerce to Vendure Product Scraper & Importer

Pipeline simple para scrapear productos de WooCommerce e importarlos a Vendure.

## 🚀 Quick Start

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configuración

Crea un archivo `.env` en la raíz del proyecto con las credenciales de tu servidor Vendure:

```bash
# Vendure API Configuration
ADMIN_API=http://localhost:3000/admin-api
ADMIN_USER=superadmin
ADMIN_PASS=superadmin
DEFAULT_STOCK_ON_HAND=100
DEFAULT_LANGUAGE=en
```

### 3. Setup de Vendure (Primera vez)

Si es la primera vez que usas el importador, necesitas configurar la Tax Zone y el Canal:

```bash
# Configurar Tax Zone, países, tasas de impuestos y canal
node scripts/setup-vendure.js
```

Este paso solo se hace **una vez**. El script configurará automáticamente todo lo necesario (Tax Zone, países, impuestos y canal).

### 4. Scrapear productos

```bash
node scripts/scraper.js \
  --startUrl="https://todaysfurniture305.com/product-category/living-room/" \
  --out="living-room.csv"
```

**Opciones principales:**
- `--startUrl`: URL de la categoría (requerido)
- `--out`: Archivo CSV de salida (default: `output/vendure-import.csv`)
- `--jsonOut`: Archivo JSON de salida (opcional)
- `--concurrency`: Páginas en paralelo (default: 2)
- `--maxPages`: Máximo de páginas (default: todas)

> **Nota:** Los archivos generados se guardan automáticamente en la carpeta `output/`

### 5. Importar a Vendure

**Asegúrate que tu servidor Vendure esté corriendo** (`http://localhost:3000`)

```bash
# Opción 1: Usando variable de entorno
export CSV_PATH="output/living-room.csv"
node scripts/import-products.js

# Opción 2: Directamente con el default (output/living-room.csv)
node scripts/import-products.js
```

¡Listo! Los productos se importarán a tu servidor Vendure.

### 6. Ver tus productos

Accede al Admin UI: `http://localhost:3000/admin`

## 📦 Estructura del Proyecto

```
products-scrapper/
├── scripts/                    # Scripts del proyecto
│   ├── scraper.js              # Scraper de WooCommerce → CSV
│   ├── import-products.js      # Importador CSV → Vendure (GraphQL API)
│   ├── setup-vendure.js        # Setup completo: Tax Zone, países, impuestos y canal
│   ├── full-pipeline.sh        # Script para scrapear e importar todo
│   └── import-all.sh           # Script para importar múltiples CSV
├── output/                     # Archivos generados (CSV, JSON)
│   ├── *.csv                   # Archivos CSV generados por el scraper
│   └── *.json                  # Archivos JSON (opcional)
├── package.json                # Dependencias
├── .env                        # Credenciales (no versionado, crealo tú)
├── .gitignore          
└── README.md                   # Esta guía
```

## 📄 Formato CSV Generado

El scraper genera un CSV con el siguiente formato compatible con Vendure:

| Columna | Descripción |
|---------|-------------|
| `name` | Nombre del producto |
| `slug` | URL slug |
| `description` | Descripción del producto |
| `sku` | SKU (se usa el slug si falta) |
| `price` | Precio en formato decimal (ej: 350.00) |
| `stockOnHand` | Stock disponible (default: 100) |
| `taxCategory` | Categoría de impuestos (default: standard) |
| `trackInventory` | true/false |
| `assets` | URLs de imágenes separadas por `\|` |
| `facets` | Categorías en formato `category:Living Room\|category:Sofas` |

## 🎯 Lo que hace el Importador

1. **Login**: Se conecta a tu servidor Vendure usando las credenciales del `.env`
2. **Crear Productos**: Crea cada producto con su información
3. **Crear Variantes**: Crea la variante por defecto con precio y stock
4. **Categorías**: 
   - Crea automáticamente un Facet "category" público
   - Crea FacetValues por cada categoría
   - Asigna las categorías a los productos
5. **Imágenes**: Descarga y sube las imágenes a Vendure

## 🔧 Scripts de Automatización

### Scrapear e importar todo automáticamente

```bash
bash scripts/full-pipeline.sh
```

Esto scrapeará todas las categorías configuradas en el script e importará todo a Vendure.

### Importar múltiples archivos CSV

```bash
bash scripts/import-all.sh
```

Importa todos los archivos `.csv` del directorio `output/`.

## 🏷️ Sistema de Categorías

El importador usa el sistema de **Facets** y **FacetValues** de Vendure:

- **Facet "category"**: Se crea automáticamente como público (visible en Shop API)
- **FacetValues**: Cada categoría del CSV se convierte en un FacetValue
- **Asignación**: Los FacetValues se asignan automáticamente a cada producto

### Ejemplo

CSV:
```
name,facets
Modern Sofa,"category:Living Room|category:Sofas"
```

Resultado en Vendure:
- Se crea el Facet "category" (si no existe)
- Se crean FacetValues: "Living Room" (código: living-room), "Sofas" (código: sofas)
- El producto "Modern Sofa" tendrá ambos FacetValues asignados

## ⚙️ Configuración Inicial de Vendure

**IMPORTANTE**: Antes de importar productos, tu servidor Vendure necesita tener configurada una Tax Zone. Si no la tienes, los productos se crearán pero las variantes fallarán con el error:

```
The active tax zone could not be determined. Ensure a default tax zone is set for the current channel.
```

### Configurar Tax Zone (Automático - Recomendado)

Ejecuta los scripts de setup incluidos:

```bash
# Configurar Tax Zone, países, tasas y canal
node scripts/setup-vendure.js
```

Estos scripts verificarán tu configuración actual y crearán/asignarán automáticamente:
- Country: United States
- Zone: Default Zone
- Tax Category: Standard
- Tax Rate: 20%
- Asignación de zona al canal por defecto

### Configurar Tax Zone (Manual desde Admin UI)

1. Ve a **Settings** → **Zones**
2. Crea una zona (ej: "Default Zone") y agrégale al menos un país
3. Ve a **Settings** → **Tax Rates**
4. Crea una tasa de impuestos (ej: "Standard Tax", 20%) y asóciala a la zona
5. Ve a **Settings** → **Channels**
6. Edita el canal "default" y asegúrate que tenga una zona por defecto

### Configurar Tax Zone (vía GraphQL)

```graphql
# 1. Crear país
mutation {
  createCountry(input: {
    code: "US"
    translations: [{ languageCode: en, name: "United States" }]
    enabled: true
  }) {
    id
  }
}

# 2. Crear zona con el país
mutation {
  createZone(input: {
    name: "Default Zone"
    memberIds: ["<COUNTRY_ID>"]
  }) {
    id
  }
}

# 3. Crear categoría de impuestos
mutation {
  createTaxCategory(input: {
    name: "Standard"
  }) {
    id
  }
}

# 4. Crear tasa de impuestos
mutation {
  createTaxRate(input: {
    name: "Standard Tax"
    enabled: true
    value: 20
    categoryId: "<TAX_CATEGORY_ID>"
    zoneId: "<ZONE_ID>"
  }) {
    id
  }
}
```

Una vez configurada la zona, vuelve a ejecutar el importador y funcionará perfectamente.

## 🔧 Troubleshooting

### "The active tax zone could not be determined"
**Este es el error más común.** Significa que Vendure no tiene configurada una Tax Zone. Sigue las instrucciones de [Configuración Inicial](#️-configuración-inicial-de-vendure) arriba.

### "Login failed"
- Verifica que tu servidor Vendure esté corriendo en `http://localhost:3000`
- Revisa las credenciales en el `.env`
- Prueba hacer login manualmente en `http://localhost:3000/admin`

### "Failed to download image"
- Las imágenes inaccesibles se saltan automáticamente
- El producto se crea de todas formas sin esa imagen

### "No products found in CSV"
- Verifica que el archivo CSV existe en `output/` y tiene productos
- Usa `export CSV_PATH="output/archivo.csv"` para especificar la ruta

### Productos no aparecen en Admin UI
- Verifica que el import finalizó exitosamente (mensaje "Import completed!")
- Refresca la página del Admin UI (`http://localhost:3000/admin`)
- Revisa los logs del servidor Vendure por posibles errores

### "SqliteError: database is locked"
- Esto puede ocurrir si hay muchas operaciones simultáneas
- El importador tiene un delay de 200ms entre productos, pero puedes aumentarlo si persiste
- Generalmente es temporal y el producto se importará bien en el siguiente intento

## 📚 Variables de Entorno

Todas las variables tienen valores por defecto, pero puedes sobreescribirlas:

| Variable | Default | Descripción |
|----------|---------|-------------|
| `ADMIN_API` | `http://localhost:3000/admin-api` | URL del Admin API |
| `ADMIN_USER` | `superadmin` | Usuario admin |
| `ADMIN_PASS` | `superadmin` | Password admin |
| `CSV_PATH` | `output/living-room.csv` | Ruta al archivo CSV |
| `DEFAULT_STOCK_ON_HAND` | `100` | Stock por defecto |
| `DEFAULT_LANGUAGE` | `en` | Idioma por defecto |

## 🎁 Ejemplos Completos

### Ejemplo 1: Scrapear Living Room e importar

```bash
# 1. Scrapear
node scripts/scraper.js \
  --startUrl="https://todaysfurniture305.com/product-category/living-room/" \
  --out="living-room.csv"

# 2. Importar
export CSV_PATH="output/living-room.csv"
node scripts/import-products.js
```

### Ejemplo 2: Scrapear múltiples categorías

```bash
# Bedroom
node scripts/scraper.js \
  --startUrl="https://todaysfurniture305.com/product-category/bedroom/" \
  --out="bedroom.csv"

# Dining
node scripts/scraper.js \
  --startUrl="https://todaysfurniture305.com/product-category/dining/" \
  --out="dining.csv"

# Office
node scripts/scraper.js \
  --startUrl="https://todaysfurniture305.com/product-category/office/" \
  --out="office.csv"

# Importar todos
bash scripts/import-all.sh
```

### Ejemplo 3: Pipeline completo automatizado

```bash
# Scrapea 7 categorías e importa todo
bash scripts/full-pipeline.sh
```

## 🛠️ Instalación Completa

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env con tus credenciales de Vendure
cat > .env << EOF
ADMIN_API=http://localhost:3000/admin-api
ADMIN_USER=superadmin
ADMIN_PASS=superadmin
DEFAULT_STOCK_ON_HAND=100
DEFAULT_LANGUAGE=en
EOF

# 3. Verificar que Vendure esté corriendo
curl http://localhost:3000/admin-api

# 4. Configurar Tax Zone y Canal (SOLO LA PRIMERA VEZ)
node scripts/setup-vendure.js

# 5. ¡Listo para usar!
# Scrapear productos
node scripts/scraper.js --startUrl="https://todaysfurniture305.com/product-category/living-room/" --out="living-room.csv"

# Importar a Vendure
node scripts/import-products.js
```

## 📦 Dependencias

```json
{
  "dependencies": {
    "puppeteer": "Para scraping con navegador headless",
    "csv-parser": "Para leer archivos CSV",
    "graphql-request": "Cliente GraphQL para Vendure API",
    "cross-fetch": "Para HTTP requests y descargar imágenes",
    "form-data": "Para subir imágenes multipart",
    "slugify": "Para generar slugs",
    "minimist": "Para argumentos CLI"
  }
}
```

## 🎨 Ver tus productos

Una vez importados, accede a:

- **Admin UI**: `http://localhost:3000/admin`
- **GraphiQL Admin**: `http://localhost:3000/graphiql/admin`
- **Shop API**: `http://localhost:3000/shop-api`

## 📚 Documentación Adicional

- **[CATEGORIES.md](./CATEGORIES.md)** - Guía detallada del sistema de categorías
- **[Vendure Docs](https://docs.vendure.io/)** - Documentación oficial de Vendure

## ✨ Features

✅ Scraping completo de WooCommerce  
✅ Exportación a CSV compatible con Vendure  
✅ Importación via GraphQL API  
✅ Soporte de categorías con Facets  
✅ Subida automática de imágenes  
✅ Manejo de errores y reintentos  
✅ Scripts de automatización incluidos  
✅ Sin necesidad de base de datos local  
✅ Se conecta a tu servidor Vendure existente  

¡A importar productos! 🚀
