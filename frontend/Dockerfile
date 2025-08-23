# Frontend Dockerfile - React + Vite
FROM node:20-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema para compilación
RUN apk add --no-cache python3 make g++

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias incluyendo dev dependencies para compilar TypeScript
RUN npm ci --only=production=false

# Copiar el código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine AS production

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar script de reemplazo de variables de entorno
COPY replace-env.sh /usr/local/bin/replace-env.sh
RUN chmod +x /usr/local/bin/replace-env.sh

# Crear usuario no privilegiado
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Cambiar permisos de los archivos
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Script de inicio que reemplaza variables y luego inicia Nginx
COPY <<EOF /usr/local/bin/start.sh
#!/bin/sh
echo "Starting application..."
/usr/local/bin/replace-env.sh
exec nginx -g "daemon off;"
EOF

RUN chmod +x /usr/local/bin/start.sh

# Comando para iniciar la aplicación
CMD ["/usr/local/bin/start.sh"]
