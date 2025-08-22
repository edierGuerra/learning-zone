# Learning Zone - Configuración Docker

Este proyecto utiliza Docker y Docker Compose para ejecutar todos los servicios de la plataforma Learning Zone.

## 📋 Prerrequisitos

- [Docker](https://www.docker.com/get-started) (versión 20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versión 2.0 o superior)

## 🚀 Inicio Rápido

### Opción 1: Usar scripts automatizados

**Windows:**
```cmd
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### Opción 2: Comandos manuales

```bash
# Construir e iniciar todos los servicios
docker-compose up --build -d

# Ver logs en tiempo real
docker-compose logs -f

# Detener todos los servicios
docker-compose down
```

## 🏗️ Arquitectura

El proyecto está compuesto por los siguientes servicios:

- **Frontend**: React + Vite + Nginx (Puerto 80)
- **Backend**: FastAPI + Python (Puerto 8000)
- **Chat Service**: Node.js + Socket.io (Puerto 3001)
- **Database**: MySQL 8.0 (Puerto 3306)

## 🌐 URLs de Acceso

Una vez iniciado, puedes acceder a:

- **Aplicación**: http://localhost
- **API Backend**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs
- **Chat Service**: http://localhost:3001
- **Base de Datos**: localhost:3306

## 🛠️ Comandos Útiles

### Gestión de Contenedores

```bash
# Ver estado de los contenedores
docker-compose ps

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f chat-service
docker-compose logs -f mysql

# Reiniciar un servicio específico
docker-compose restart backend

# Ejecutar comandos dentro de un contenedor
docker-compose exec backend bash
docker-compose exec mysql mysql -u root -p

# Detener y eliminar contenedores
docker-compose down

# Detener y eliminar todo (incluyendo volúmenes)
docker-compose down -v
```

### Desarrollo

Para desarrollo, usa el archivo `docker-compose.dev.yml`:

```bash
# Iniciar en modo desarrollo (con hot reload)
docker-compose -f docker-compose.dev.yml up --build

# Solo backend y base de datos para desarrollo frontend local
docker-compose -f docker-compose.dev.yml up mysql backend
```

### Base de Datos

```bash
# Conectar a MySQL
docker-compose exec mysql mysql -u Edier -p learning_zone_db

# Hacer backup de la base de datos
docker-compose exec mysql mysqldump -u root -p learning_zone_db > backup.sql

# Restaurar base de datos
docker-compose exec -T mysql mysql -u root -p learning_zone_db < backup.sql
```

## 📁 Estructura de Archivos Docker

```
├── docker-compose.yml          # Configuración principal de producción
├── docker-compose.dev.yml      # Configuración para desarrollo
├── start.sh / start.bat        # Scripts de inicio automatizado
├── mysql-init/                 # Scripts de inicialización de MySQL
├── backend/
│   ├── Dockerfile              # Imagen de producción del backend
│   ├── Dockerfile.dev          # Imagen de desarrollo del backend
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile              # Imagen de producción del frontend
│   ├── nginx.conf              # Configuración de Nginx
│   └── .dockerignore
└── chat-service/
    ├── Dockerfile              # Imagen de producción del chat
    ├── Dockerfile.dev          # Imagen de desarrollo del chat
    └── .dockerignore
```

## 🔧 Variables de Entorno

Las variables de entorno están configuradas directamente en el `docker-compose.yml`. Para desarrollo, puedes crear un archivo `.env` en la raíz del proyecto:

```env
# Ejemplo de .env para desarrollo
SENDGRID_API_KEY=tu_api_key_aqui
GEMINI_API_KEY=tu_api_key_aqui
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_secret_aqui
```

## 🔍 Solución de Problemas

### Puerto en uso
```bash
# Ver qué proceso usa el puerto
netstat -tlnp | grep :80
# o en Windows
netstat -an | findstr :80

# Detener todos los contenedores de Docker
docker stop $(docker ps -aq)
```

### Problemas de permisos (Linux/Mac)
```bash
# Dar permisos al script
chmod +x start.sh

# Si hay problemas con volúmenes
sudo chown -R $USER:$USER ./
```

### Limpiar Docker
```bash
# Limpiar contenedores, redes e imágenes no utilizadas
docker system prune -a

# Limpiar volúmenes
docker volume prune
```

### Base de datos no inicializa
```bash
# Eliminar volumen de MySQL y recrear
docker-compose down -v
docker volume rm learning-zone_mysql_data
docker-compose up --build
```

## 📊 Monitoreo

### Health Checks

Todos los servicios incluyen health checks que puedes verificar:

```bash
# Ver el estado de salud de los contenedores
docker-compose ps

# Ver logs de health checks
docker-compose logs backend | grep health
```

### Métricas de Rendimiento

```bash
# Ver uso de recursos
docker stats

# Ver logs en tiempo real de todos los servicios
docker-compose logs -f --tail=100
```

## 🚀 Producción

Para despliegue en producción:

1. Actualiza las variables de entorno en `docker-compose.yml`
2. Asegúrate de que los puertos estén disponibles
3. Configura un proxy reverso (nginx) si es necesario
4. Implementa backups automáticos de la base de datos

```bash
# Ejecutar en modo producción
docker-compose up -d --build

# Verificar que todo esté funcionando
docker-compose ps
curl http://localhost/health
```
