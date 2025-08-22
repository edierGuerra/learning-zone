#!/bin/bash

# Script para iniciar el proyecto Learning Zone con Docker

echo "🚀 Iniciando Learning Zone con Docker..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Construir e iniciar los contenedores
echo "📦 Construyendo e iniciando contenedores..."
docker-compose up --build -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar el estado de los contenedores
echo "📊 Estado de los contenedores:"
docker-compose ps

echo "✅ Learning Zone está ejecutándose!"
echo ""
echo "🌐 URLs disponibles:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:8000"
echo "   Backend Docs: http://localhost:8000/docs"
echo "   Chat Service: http://localhost:3001"
echo "   MySQL: localhost:3306"
echo ""
echo "🛠️  Comandos útiles:"
echo "   Ver logs: docker-compose logs -f [servicio]"
echo "   Detener: docker-compose down"
echo "   Reiniciar: docker-compose restart [servicio]"
