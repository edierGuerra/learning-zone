# database/config_db.py
# ============================================
# Conexión a la base de datos (Async SQLAlchemy)
# ============================================

# ---------------------------
# Módulo interno (config)
# ---------------------------
# De config importamos settings para usar las variables de entorno
from config import settings  # settings.database_url

# ---------------------------
# Módulos externos
# ---------------------------
import ssl
from pathlib import Path
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text

# ---------------------------
# Definimos la URL de conexión
# ---------------------------
# Obtener DATABASE_URL de las variables de entorno
raw_database_url = settings.database_url

# Convertir automáticamente de mysql:// a mysql+asyncmy:// para compatibilidad
if raw_database_url.startswith("mysql://"):
    DATABASE_URL = raw_database_url.replace("mysql://", "mysql+asyncmy://")
elif raw_database_url.startswith("mysql+aiomysql://"):
    DATABASE_URL = raw_database_url.replace("mysql+aiomysql://", "mysql+asyncmy://")
elif not raw_database_url.startswith("mysql+asyncmy://"):
    # Si no tiene el esquema correcto, agregarlo
    if "://" not in raw_database_url:
        DATABASE_URL = f"mysql+asyncmy://{raw_database_url}"
    else:
        DATABASE_URL = raw_database_url
else:
    DATABASE_URL = raw_database_url

print(f"✅ DATABASE_URL configurado para asyncmy")
print(f"🔗 Host: {DATABASE_URL.split('@')[1].split('/')[0] if '@' in DATABASE_URL else 'hidden'}")

# ---------------------------
# SSL/TLS para DigitalOcean
# ---------------------------
# DigitalOcean Managed MySQL exige TLS (sslmode=REQUIRED). En Windows, la verificación
# suele fallar si no se indica explícitamente la CA del clúster.
#
# Archivo de CA (descargado desde el panel de DO):
#   backend/certs/ca-certificate.crt
#
# Construimos la ruta de forma robusta relativa a este archivo:
PROJECT_ROOT = Path(__file__).resolve().parents[1]  # .../backend
CA_PATH = PROJECT_ROOT / "certs" / "ca-certificate.crt"

# Configuración SSL más robusta para DigitalOcean
def create_ssl_context():
    """Crea un contexto SSL robusto para la conexión a DigitalOcean"""
    try:
        # Verificar que el archivo de certificado existe
        if not CA_PATH.exists():
            print(f"⚠️ Certificado CA no encontrado en: {CA_PATH}")
            print("⚠️ Usando SSL básico sin validación de CA")
            return True  # SSL básico sin validación específica
        
        # Crear contexto SSL con CA específica
        ssl_ctx = ssl.create_default_context(cafile=str(CA_PATH))
        ssl_ctx.check_hostname = True
        ssl_ctx.verify_mode = ssl.CERT_REQUIRED
        
        # Endurecer versión mínima de TLS si está disponible (Python 3.7+)
        if hasattr(ssl, "TLSVersion"):
            ssl_ctx.minimum_version = ssl.TLSVersion.TLSv1_2
            
        print("✅ Contexto SSL configurado con CA de DigitalOcean")
        return ssl_ctx
        
    except Exception as e:
        print(f"⚠️ Error configurando SSL con CA: {e}")
        print("⚠️ Fallback a SSL básico")
        return True  # Fallback a SSL básico

# ---------------------------
# Motor de conexión asíncrono
# ---------------------------
# NOTA 1: Usando asyncmy en lugar de aiomysql para mejor compatibilidad con Docker
# NOTA 2: asyncmy es más estable y tiene mejor soporte para contenedores
# NOTA 3: La configuración SSL funciona igual con ambos drivers

# Obtener configuración SSL
ssl_config = create_ssl_context()

engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Cambiar a False en producción para mejor performance
    pool_pre_ping=True,  # Evita conexiones zombies (reintento keep-alive)
    pool_recycle=3600,  # Reciclar conexiones cada hora
    pool_size=5,  # Número de conexiones en el pool
    max_overflow=10,  # Conexiones adicionales permitidas
    connect_args={
        "ssl": ssl_config,  # <- CAMBIO: Configuración SSL robusta
        "charset": "utf8mb4",  # Soporte completo para UTF-8
    },
)

# ---------------------------
# Fábrica de sesiones async
# ---------------------------
async_session = async_sessionmaker(
    engine,
    expire_on_commit=False,  # Mantiene objetos vivos tras commit (útil para reusar datos)
)


# ---------------------------
# Base declarativa para los modelos
# ---------------------------
class Base(DeclarativeBase):
    """Base de todos los modelos ORM (Student, Identification, etc.)."""

    pass


# ---------------------------
# Dependencia de sesión (FastAPI)
# ---------------------------
async def get_session():
    """
    Proporciona una sesión de base de datos asíncrona por request.
    Se usa con Depends en FastAPI.
    """
    async with async_session() as session:
        yield session


# ---------------------------
# Función de verificación de conectividad
# ---------------------------
async def verify_database_connection():
    """
    Verifica la conexión a la base de datos.
    Útil para health checks y diagnósticos.
    """
    try:
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT 1 as test"))
            row = result.fetchone()
            return {
                "status": "connected", 
                "test_query": "OK",
                "result": row[0] if row else None,
                "database_url": DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else "hidden"
            }
    except Exception as e:
        import traceback
        return {
            "status": "error", 
            "message": str(e),
            "error_type": type(e).__name__,
            "traceback": traceback.format_exc()
        }


# ---------------------------
# Función para cerrar conexiones
# ---------------------------
async def close_database_connections():
    """
    Cierra todas las conexiones de la base de datos.
    Útil para shutdown graceful.
    """
    await engine.dispose()