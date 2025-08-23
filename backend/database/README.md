# Configuración de Base de Datos para DigitalOcean

## Pasos para configurar MySQL en DigitalOcean App Platform

### 1. Crear Managed Database
1. En tu proyecto de DigitalOcean, ir a "Create" → "Database"
2. Seleccionar **MySQL 8.0**
3. Configuración recomendada:
   - **Plan**: Basic (para desarrollo) o Professional (para producción)
   - **RAM**: Mínimo 1GB
   - **Región**: La misma que tu aplicación
   - **Database name**: `learning_zone`
   - **User**: `learning_zone_user` (automático)

### 2. Configurar SSL/TLS
- DigitalOcean requiere conexiones SSL por defecto
- Descargar el certificado CA desde el panel de control
- Guardar como `backend/certs/ca-certificate.crt`

### 3. Variables de entorno requeridas
```env
# URL de conexión (la proporciona DigitalOcean)
DATABASE_URL=mysql+aiomysql://username:password@host:25060/learning_zone

# Configuración de ambiente
ENVIRONMENT=production
```

### 4. Configuración de la aplicación
El backend está configurado para:
- ✅ Conexiones SSL/TLS seguras
- ✅ Pool de conexiones optimizado
- ✅ Reconexión automática
- ✅ Health checks de base de datos
- ✅ Manejo de errores robusto

### 5. Endpoints de monitoreo
- `/health` - Health check general
- `/api/status` - Estado completo del sistema
- `/api/database/status` - Estado específico de la base de datos

### 6. Características de seguridad
- Validación de certificados SSL
- Pool de conexiones limitado
- Timeout de conexiones
- Charset UTF-8 completo
- Modo estricto de SQL

### 7. Conectar con la aplicación
Una vez creada la base de datos:
1. Copiar la URL de conexión desde DigitalOcean
2. Configurar la variable `DATABASE_URL` en todos los componentes
3. La aplicación creará automáticamente las tablas en el primer arranque
