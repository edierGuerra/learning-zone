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

# Convertir automáticamente a mysql+aiomysql:// para compatibilidad
if raw_database_url.startswith("mysql://"):
    DATABASE_URL = raw_database_url.replace("mysql://", "mysql+aiomysql://")
elif raw_database_url.startswith("mysql+asyncmy://"):
    DATABASE_URL = raw_database_url.replace("mysql+asyncmy://", "mysql+aiomysql://")
elif not raw_database_url.startswith("mysql+aiomysql://"):
    # Si no tiene el esquema correcto, agregarlo
    if "://" not in raw_database_url:
        DATABASE_URL = f"mysql+aiomysql://{raw_database_url}"
    else:
        DATABASE_URL = raw_database_url
else:
    DATABASE_URL = raw_database_url

print(f"✅ DATABASE_URL configurado para aiomysql")
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
        import os
        import ssl as ssl_module
        
        # Para aiomysql en DigitalOcean, usar configuración SSL compatible
        # DigitalOcean Managed MySQL requiere SSL pero con verificación específica
        
        # En producción (DigitalOcean), usar SSL sin verificación estricta
        if os.getenv("ENVIRONMENT", "development") == "production":
            print("✅ Configurando SSL para producción (aiomysql + DigitalOcean)")
            # Crear contexto SSL que acepta certificados auto-firmados de DigitalOcean
            ssl_context = ssl_module.create_default_context()
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl_module.CERT_NONE
            # Permitir certificados auto-firmados
            ssl_context.set_ciphers('DEFAULT')
            return {"ssl": ssl_context}
        
        # En desarrollo, usar configuración SSL más permisiva
        print("✅ Configurando SSL para desarrollo")
        ssl_context = ssl_module.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl_module.CERT_NONE
        
        # Intentar cargar certificado CA si existe
        if CA_PATH.exists():
            try:
                ssl_context.load_verify_locations(cafile=str(CA_PATH))
                print(f"✅ Certificado CA cargado: {CA_PATH}")
            except Exception as e:
                print(f"⚠️ No se pudo cargar el certificado CA: {e}")
        
        return {"ssl": ssl_context}
        
    except Exception as e:
        print(f"⚠️ Error configurando SSL: {e}")
        print("⚠️ Fallback a SSL básico")
        return {"ssl": True}

# ---------------------------
# Motor de conexión asíncrono
# ---------------------------
# NOTA 1: Usando aiomysql para mejor compatibilidad con Windows
# NOTA 2: aiomysql es más fácil de instalar y no requiere compilación
# NOTA 3: La configuración SSL funciona con contextos SSL estándar de Python

# Obtener configuración SSL
ssl_config = create_ssl_context()

# Para aiomysql, la configuración SSL va en connect_args
connect_args = {
    "charset": "utf8mb4",  # Soporte completo para UTF-8
}

# Agregar configuración SSL
if isinstance(ssl_config, dict):
    # Los parámetros SSL van directamente en connect_args para aiomysql
    connect_args.update(ssl_config)
    print(f"✅ SSL configurado para aiomysql: {list(ssl_config.keys())}")
else:
    # SSL básico por defecto para DigitalOcean
    connect_args["ssl"] = True
    print("⚠️ Usando configuración SSL básica por defecto")

engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Cambiar a False en producción para mejor performance
    pool_pre_ping=True,  # Evita conexiones zombies (reintento keep-alive)
    pool_recycle=3600,  # Reciclar conexiones cada hora
    pool_size=5,  # Número de conexiones en el pool
    max_overflow=10,  # Conexiones adicionales permitidas
    connect_args=connect_args,
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