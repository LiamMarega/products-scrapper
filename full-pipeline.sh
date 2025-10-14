#!/bin/bash
# full-pipeline.sh - Pipeline completo: Scrapear + Importar
# Usage: bash full-pipeline.sh

set -e

echo "🚀 Today's Furniture → Vendure - Pipeline Completo"
echo "===================================================="
echo ""

# ============================================================================
# PASO 1: SCRAPING
# ============================================================================

echo "📍 PASO 1/2: SCRAPING"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

BASE_URL="https://todaysfurniture305.com/product-category"
CONCURRENCY=3
MAX_PAGES=999
DELAY_MS=400

declare -a CATEGORIES=(
  "living-room"
  "dining"
  "bedroom"
  "tv-stands"
  "accessories"
  "office"
  "clearance"
)

echo "📋 Categorías: ${#CATEGORIES[@]}"
echo ""

START_TIME=$(date +%s)

for category in "${CATEGORIES[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔍 Scrapeando: $category"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  node scraper.js \
    --startUrl="$BASE_URL/$category/" \
    --out="$category.xlsx" \
    --jsonOut="$category.json" \
    --concurrency=$CONCURRENCY \
    --maxPages=$MAX_PAGES \
    --delayMs=$DELAY_MS
  
  echo ""
  echo "✅ $category.xlsx generado"
  echo ""
  sleep 2
done

SCRAPE_TIME=$(($(date +%s) - START_TIME))

echo "✅ Scraping completado en ${SCRAPE_TIME}s"
echo ""
echo ""

# ============================================================================
# PASO 2: IMPORTACIÓN
# ============================================================================

echo "📍 PASO 2/2: IMPORTACIÓN A VENDURE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

export ADMIN_API="${ADMIN_API:-http://localhost:3000/admin-api}"
export ADMIN_USER="${ADMIN_USER:-superadmin}"
export ADMIN_PASS="${ADMIN_PASS:-superadmin}"
export DEFAULT_STOCK_ON_HAND="${DEFAULT_STOCK_ON_HAND:-100}"
export DEFAULT_LANGUAGE="es"

echo "🔧 Configuración Vendure:"
echo "   API: $ADMIN_API"
echo "   User: $ADMIN_USER"
echo "   Stock: $DEFAULT_STOCK_ON_HAND unidades"
echo ""

XLSX_FILES=($(ls *.xlsx 2>/dev/null))

if [ ${#XLSX_FILES[@]} -eq 0 ]; then
  echo "❌ No se encontraron archivos .xlsx"
  exit 1
fi

echo "📋 Archivos a importar: ${#XLSX_FILES[@]}"
echo ""

TOTAL=${#XLSX_FILES[@]}
CURRENT=0
SUCCESS=0
FAILED=0

IMPORT_START=$(date +%s)

for file in "${XLSX_FILES[@]}"; do
  CURRENT=$((CURRENT + 1))
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📥 [$CURRENT/$TOTAL] Importando: $file"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  export XLSX_PATH="$(pwd)/$file"
  
  if node import-products.js; then
    SUCCESS=$((SUCCESS + 1))
    echo "✅ $file importado"
  else
    FAILED=$((FAILED + 1))
    echo "❌ Error en $file"
  fi
  
  echo ""
  
  if [ $CURRENT -lt $TOTAL ]; then
    sleep 3
  fi
done

IMPORT_TIME=$(($(date +%s) - IMPORT_START))
TOTAL_TIME=$((SCRAPE_TIME + IMPORT_TIME))

# ============================================================================
# RESUMEN FINAL
# ============================================================================

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║          🎉 PIPELINE COMPLETADO 🎉              ║"
echo "╠══════════════════════════════════════════════════╣"
echo "║                                                  ║"
echo "║  📊 Scraping:                                    ║"
echo "║     • Categorías: ${#CATEGORIES[@]}                              ║"
echo "║     • Tiempo: ${SCRAPE_TIME}s                             ║"
echo "║                                                  ║"
echo "║  📦 Importación:                                 ║"
echo "║     • Exitosos: $SUCCESS                                ║"
echo "║     • Fallidos: $FAILED                                 ║"
echo "║     • Tiempo: ${IMPORT_TIME}s                            ║"
echo "║                                                  ║"
echo "║  ⏱️  Tiempo total: ${TOTAL_TIME}s                         ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "🌐 Verificá tus productos en:"
echo "   ${ADMIN_API/admin-api/admin}"
echo ""

# Listar archivos generados
echo "📁 Archivos generados:"
ls -lh *.xlsx *.json 2>/dev/null | awk '{print "   " $9 " (" $5 ")"}'
echo ""