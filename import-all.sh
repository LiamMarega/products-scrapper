#!/bin/bash
# import-all.sh - Importa todos los XLSX a Vendure
# Usage: bash import-all.sh

set -e  # Exit on error

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

# Buscar todos los archivos XLSX
XLSX_FILES=($(ls *.xlsx 2>/dev/null))

if [ ${#XLSX_FILES[@]} -eq 0 ]; then
  echo "❌ No se encontraron archivos .xlsx en el directorio actual"
  echo "   Ejecutá primero: bash scrape-all.sh"
  exit 1
fi

echo "📋 Archivos a importar: ${#XLSX_FILES[@]}"
echo ""

# Contador de progreso
TOTAL=${#XLSX_FILES[@]}
CURRENT=0
SUCCESS=0
FAILED=0

# Importar cada archivo
for file in "${XLSX_FILES[@]}"; do
  CURRENT=$((CURRENT + 1))
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📥 [$CURRENT/$TOTAL] Importando: $file"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  export XLSX_PATH="$(pwd)/$file"
  
  if node import-products.js; then
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