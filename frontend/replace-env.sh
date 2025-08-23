#!/bin/sh

# Script para reemplazar variables de entorno en archivos estáticos
# Se ejecuta durante el build en DigitalOcean

# Valores por defecto si no están definidas las variables
VITE_API_URL_DEFAULT="https://learning-zone-backend.ondigitalocean.app"
VITE_CHAT_URL_DEFAULT="https://learning-zone-chat.ondigitalocean.app"

# Usar variables de entorno o valores por defecto
API_URL=${VITE_API_URL:-$VITE_API_URL_DEFAULT}
CHAT_URL=${VITE_CHAT_URL:-$VITE_CHAT_URL_DEFAULT}

echo "Replacing environment variables..."
echo "API_URL: $API_URL"
echo "CHAT_URL: $CHAT_URL"

# Buscar y reemplazar en todos los archivos JS y CSS del build
find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) -exec sed -i "s|__VITE_API_URL__|$API_URL|g" {} \;
find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) -exec sed -i "s|__VITE_CHAT_URL__|$CHAT_URL|g" {} \;

echo "Environment variables replacement completed."
