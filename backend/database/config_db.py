#conexion a la base de datos

# database.py
""" Configuración de la conexion con la base de datos """

# Modulos esternos
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os # Importamos el módulo os para acceder a las variables de entorno
from dotenv import load_dotenv # Importamos load_dotenv

# Cargamos las variables de entorno del archivo .env
load_dotenv()

# Definimos la URL de conexión
# Usamos asyncmy como driver asincrónico para MySQL
# Ahora obtenemos la URL de las variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL")

# Creamos el motor de conexión asíncrono
engine = create_async_engine(
    DATABASE_URL,
    echo=True,    # Para mostrar en consola las consultas SQL ejecutadas
)

# Creamos la fábrica de sesiones asíncronas
async_session = async_sessionmaker(
    engine,
    expire_on_commit=False,
)

# Base declarativa para los modelos
class Base(DeclarativeBase):
    pass

# Dependencia para obtener una sesión en cada operación
async def get_session():
    """
    Proporciona una sesión de base de datos asíncrona en cada request.
    Se usa con Depends en FastAPI.
    """
    async with async_session() as session:
        yield session