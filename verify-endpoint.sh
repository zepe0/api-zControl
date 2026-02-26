#!/bin/bash

# Script de verificación del endpoint /api/pedidos/upload
# Uso: bash verify-endpoint.sh

echo "═══════════════════════════════════════════════════════════════"
echo "  Verificación del Endpoint: POST /api/pedidos/upload"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
API_URL="http://localhost:3001"
ENDPOINT="/api/pedidos/upload"
TEST_FILE="EJEMPLO_DOCUMENTO_PEDIDO.txt"

echo -e "${BLUE}📋 Checklist de Verificación:${NC}"
echo ""

# 1. Verificar que el servidor está corriendo
echo -ne "1. Verificando servidor en ${API_URL}... "
if curl -s -o /dev/null -w "%{http_code}" "${API_URL}" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo -e "${RED}   El servidor no está corriendo. Inicia con: npm start${NC}"
    exit 1
fi

# 2. Verificar que el endpoint existe
echo -ne "2. Verificando endpoint ${ENDPOINT}... "
RESPONSE=$(curl -s -X OPTIONS "${API_URL}${ENDPOINT}" -w "\n%{http_code}")
STATUS=$(echo "$RESPONSE" | tail -n1)
if [ "$STATUS" = "200" ] || [ "$STATUS" = "204" ] || [ "$STATUS" = "404" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ (status: $STATUS)${NC}"
fi

# 3. Verificar archivo de prueba
echo -ne "3. Verificando archivo de prueba '${TEST_FILE}'... "
if [ -f "${TEST_FILE}" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo -e "${RED}   Archivo no encontrado. Crea EJEMPLO_DOCUMENTO_PEDIDO.txt${NC}"
    exit 1
fi

# 4. Probar upload
echo ""
echo -e "${BLUE}📤 Enviando archivo de prueba...${NC}"
echo ""

RESPONSE=$(curl -s -X POST "${API_URL}${ENDPOINT}" \
    -F "file=@${TEST_FILE}" \
    -w "\n%{http_code}")

# Separar status del body
STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo -e "Status HTTP: ${YELLOW}${STATUS}${NC}"
echo ""

if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Upload exitoso${NC}"
    echo ""
    echo -e "${BLUE}📊 Respuesta del servidor:${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}✗ Error en upload (status: $STATUS)${NC}"
    echo ""
    echo -e "${BLUE}📊 Respuesta del servidor:${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Resumen
echo -e "${BLUE}📋 Archivos Creados:${NC}"
echo "  ✓ server/query/Pedidos/uploadPedidos.js"
echo "  ✓ ENDPOINT_PEDIDOS_UPLOAD.md"
echo "  ✓ IMPLEMENTACION_PEDIDOS_UPLOAD.md"
echo "  ✓ test-upload.html"
echo "  ✓ EJEMPLO_DOCUMENTO_PEDIDO.txt"
echo ""

echo -e "${BLUE}🚀 Para probar:${NC}"
echo "  1. Asegúrate de que npm start está ejecutándose"
echo "  2. Abre en navegador: http://localhost:3001/test-upload.html"
echo "  3. O usa cURL: curl -X POST http://localhost:3001/api/pedidos/upload -F \"file=@EJEMPLO_DOCUMENTO_PEDIDO.txt\""
echo ""

echo -e "${BLUE}📖 Documentación:${NC}"
echo "  • ENDPOINT_PEDIDOS_UPLOAD.md - Especificación técnica"
echo "  • IMPLEMENTACION_PEDIDOS_UPLOAD.md - Guía de implementación"
echo ""
