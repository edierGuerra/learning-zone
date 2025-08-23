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
# Ahora la obtenemos de nuestra instancia de configuración.
# IMPORTANTE: Asegúrate de que settings.database_url NO incluya "?ssl=true" ni "http://"
# Ejemplo correcto:
# mysql+aiomysql://USER:PASS@HOST:25060/defaultdb
DATABASE_URL = settings.database_url

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

# Creamos un contexto SSL que:
#   - Usa la CA de DO para validar el certificado del servidor
#   - Verifica hostname
#   - Exige verificación de certificado
ssl_ctx = ssl.create_default_context(cafile=str(CA_PATH))
ssl_ctx.check_hostname = True
ssl_ctx.verify_mode = ssl.CERT_REQUIRED
# Endurecer versión mínima de TLS si está disponible (Python 3.7+)
if hasattr(ssl, "TLSVersion"):
    ssl_ctx.minimum_version = ssl.TLSVersion.TLSv1_2

# ---------------------------
# Motor de conexión asíncrono
# ---------------------------
# NOTA 1: Antes usabas connect_args={"ssl": True}. Eso habilita TLS pero NO valida la CA,
#         y puede romper en Windows. Ahora pasamos un SSLContext real con la CA.
# NOTA 2: Si prefieres, puedes usar asyncmy en lugar de aiomysql. Cambiarías el esquema
#         a "mysql+asyncmy://..." y mantienes connect_args={"ssl": ssl_ctx}.

# Verificar que el archivo de certificado existe
if not CA_PATH.exists():
    raise FileNotFoundError(f"Certificado CA no encontrado en: {CA_PATH}")

engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Cambiar a False en producción para mejor performance
    pool_pre_ping=True,  # Evita conexiones zombies (reintento keep-alive)
    pool_recycle=3600,  # Reciclar conexiones cada hora
    pool_size=5,  # Número de conexiones en el pool
    max_overflow=10,  # Conexiones adicionales permitidas
    connect_args={
        "ssl": ssl_ctx,  # <- CAMBIO CLAVE: SSLContext con la CA de DO
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
            return {"status": "connected", "test_query": "OK"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# ---------------------------
# Función para cerrar conexiones
# ---------------------------
async def close_database_connections():
    """
    Cierra todas las conexiones de la base de datos.
    Útil para shutdown graceful.
    """
    await engine.dispose()