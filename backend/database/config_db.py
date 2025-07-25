# database/config_db.py
# conexion a la base de datos

# database.py
"""Configuración de la conexion con la base de datos"""

# Módulo interno: Importamos nuestra instancia de configuración
from config import settings  # de config importamos settings

# Modulos esternos
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

# Definimos la URL de conexión
# Ahora la obtenemos de nuestra instancia de configuración
DATABASE_URL = settings.database_url


# Creamos el motor de conexión asíncrono, esto nos conecta directamente con la base de datos.
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Para mostrar en consola las consultas SQL ejecutadas
)

# Creamos la fábrica de sesiones asíncronas
async_session = async_sessionmaker(
    engine,
    expire_on_commit=False,
)


# Base declarativa para los modelos
# Base de todos los modelos ORM (Student, Identification, etc.).
class Base(DeclarativeBase):
    pass


# Dependencia para obtener una sesión en cada operación
# Función especial que da una nueva sesión por request, con yield.
async def get_session():
    """
    Proporciona una sesión de base de datos asíncrona en cada request.
    Se usa con Depends en FastAPI.
    """
    async with async_session() as session:
        yield session
