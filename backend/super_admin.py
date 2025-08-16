# create_admin_mysql.py
import sys
import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from database.config_db import async_session, engine
from teacher.model import Teacher
from sqlalchemy import select
import bcrypt
from config import settings

# Configuración del logger
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


async def admin_exists(email: str, db: AsyncSession) -> bool:
    stmt = select(Teacher).where(Teacher.email == email)
    result = await db.execute(stmt)
    return result.scalar_one_or_none() is not None


async def create_admin():
    logger.info("== Crear administrador de la plataforma ==")
    email = settings.admin_email

    async with async_session() as db:
        if await admin_exists(email, db):
            logger.warning(
                f"Ya existe un administrador/profesor con el email {email}. No se realizaron cambios."
            )
            await engine.dispose()
            logger.info("Conexión a la base de datos cerrada.")
            return

        name = settings.admin_name
        password = settings.admin_password

        try:
            hashed = hash_password(password)
            admin = Teacher(names=name, email=email, password=hashed)
            db.add(admin)
            await db.commit()
            await db.refresh(admin)
            logger.info(
                f"Administrador registrado exitosamente. ID: {admin.id} | Email: {admin.email}"
            )
        except Exception as e:
            await db.rollback()
            logger.error(f"Error al crear el administrador: {str(e)}")
            sys.exit(1)
    await engine.dispose()
    logger.info("Conexión a la base de datos cerrada.")


if __name__ == "__main__":
    asyncio.run(create_admin())
