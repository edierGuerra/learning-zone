# Chat Service Dockerfile - Node.js + TypeScript
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias incluyendo dev dependencies para compilar TypeScript
RUN npm ci

# Copiar el código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 3001

# Variables de entorno
ENV NODE_ENV=production

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
