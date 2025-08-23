# Frontend Dockerfile simplificado para DigitalOcean
FROM node:20-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema para compilación
RUN apk add --no-cache python3 make g++

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --include=dev

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine AS production

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar archivos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar y hacer ejecutable el script de inicio
COPY replace-env.sh /usr/local/bin/replace-env.sh
RUN chmod +x /usr/local/bin/replace-env.sh

# Crear script de inicio
RUN echo '#!/bin/sh' > /usr/local/bin/start.sh && \
    echo 'echo "Starting application..."' >> /usr/local/bin/start.sh && \
    echo '/usr/local/bin/replace-env.sh' >> /usr/local/bin/start.sh && \
    echo 'exec nginx -g "daemon off;"' >> /usr/local/bin/start.sh && \
    chmod +x /usr/local/bin/start.sh

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Comando para iniciar la aplicación
CMD ["/usr/local/bin/start.sh"]
