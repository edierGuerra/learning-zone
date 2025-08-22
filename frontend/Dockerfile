# Frontend Dockerfile - React + Vite
FROM node:18-alpine as build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias incluyendo dev dependencies para compilar TypeScript
RUN npm ci

# Copiar el código fuente
COPY . .

# Construir la aplicación para producción (solo Vite build, sin verificación TypeScript)
RUN npx vite build

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
