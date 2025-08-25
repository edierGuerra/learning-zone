#!/bin/sh

# Script para reemplazar variables de entorno en archivos estáticos
# Se ejecuta durante el build en DigitalOcean

# URLs de producción con nuevo dominio
API_URL="https://cjetechnology.org/backend"
CHAT_URL="https://cjetechnology.org/chat"

# Usar variables de entorno si están disponibles, sino usar las por defecto
API_URL=${VITE_API_URL:-$API_URL}
CHAT_URL=${VITE_CHAT_URL:-$CHAT_URL}

echo "Replacing environment variables..."
echo "API_URL: $API_URL"
echo "CHAT_URL: $CHAT_URL"

# Buscar y reemplazar en todos los archivos JS y CSS del build
find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) -exec sed -i "s|__VITE_API_URL__|$API_URL|g" {} \;
find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) -exec sed -i "s|__VITE_CHAT_URL__|$CHAT_URL|g" {} \;

echo "Environment variables replacement completed."
