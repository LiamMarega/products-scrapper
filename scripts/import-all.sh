#!/bin/bash
# import-all.sh - Importa todos los CSV a Vendure
# Usage: bash scripts/import-all.sh

set -e  # Exit on error

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/output"

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Change to project root for relative paths
cd "$PROJECT_ROOT"

echo "📦 Vendure - Importador Automático"
echo "===================================="
echo ""

# Configuración de Vendure
export ADMIN_API="${ADMIN_API:-http://localhost:3000/admin-api}"
export ADMIN_USER="${ADMIN_USER:-superadmin}"
export ADMIN_PASS="${ADMIN_PASS:-superadmin}"
export DEFAULT_STOCK_ON_HAND="${DEFAULT_STOCK_ON_HAND:-100}"
export DEFAULT_LANGUAGE="es"

echo "🔧 Configuración:"
echo "   API: $ADMIN_API"
echo "   User: $ADMIN_USER"
echo "   Stock por defecto: $DEFAULT_STOCK_ON_HAND"
echo ""

# Buscar todos los archivos CSV en output/
CSV_FILES=($(ls "$OUTPUT_DIR"/*.csv 2>/dev/null | xargs -n1 basename))

if [ ${#CSV_FILES[@]} -eq 0 ]; then
  echo "❌ No se encontraron archivos .csv en output/"
  echo "   Ejecutá primero los scripts de scraping"
  exit 1
fi

echo "📋 Archivos a importar: ${#CSV_FILES[@]}"
echo ""

# Contador de progreso
TOTAL=${#CSV_FILES[@]}
CURRENT=0
SUCCESS=0
FAILED=0

# Importar cada archivo
for file in "${CSV_FILES[@]}"; do
  CURRENT=$((CURRENT + 1))
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📥 [$CURRENT/$TOTAL] Importando: $file"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  export CSV_PATH="$OUTPUT_DIR/$file"
  
  if node scripts/import-products.js; then
    SUCCESS=$((SUCCESS + 1))
    echo ""
    echo "✅ $file importado exitosamente"
  else
    FAILED=$((FAILED + 1))
    echo ""
    echo "❌ Error importando $file"
  fi
  
  echo ""
  
  # Delay entre imports para no saturar la API
  if [ $CURRENT -lt $TOTAL ]; then
    echo "⏳ Esperando 3 segundos antes del siguiente..."
    sleep 3
    echo ""
  fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Importación completada!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Resumen:"
echo "   ✅ Exitosos: $SUCCESS"
echo "   ❌ Fallidos: $FAILED"
echo "   📦 Total: $TOTAL"
echo ""
echo "🌐 Admin UI: ${ADMIN_API/admin-api/admin}"
echo ""