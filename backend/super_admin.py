# create_admin_mysql.py
import sys
import asyncio
from getpass import getpass
from sqlalchemy.ext.asyncio import AsyncSession
from database.config_db import async_session, engine
from teacher.model import Teacher
from sqlalchemy import select
import bcrypt


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


async def admin_exists(email: str, db: AsyncSession) -> bool:
    stmt = select(Teacher).where(Teacher.email == email)
    result = await db.execute(stmt)
    return result.scalar_one_or_none() is not None


async def create_admin():
    print("== Crear administrador de la plataforma ==")
    email = input("Email: ").strip()

    async with async_session() as db:
        if await admin_exists(email, db):
            print(
                f"Ya existe un administrador/profesor con el email {email}. No se realizaron cambios."
            )
            await engine.dispose()
            print("Conexión a la base de datos cerrada.")
            return

        name = input("Nombre completo: ").strip()
        apellido = input("Apellido completo: ").strip()
        while True:
            password = getpass("Contraseña: ")
            confirm = getpass("Confirma la contraseña: ")
            if password == confirm and len(password) >= 8:
                break
            print(
                "Las contraseñas no coinciden o son demasiado cortas (mínimo 8 caracteres)."
            )

        try:
            hashed = hash_password(password)
            admin = Teacher(name=name, last_name=apellido, email=email, password=hashed)
            db.add(admin)
            await db.commit()
            await db.refresh(admin)
            print(
                f"Administrador registrado exitosamente. ID: {admin.id} | Email: {admin.email}"
            )
        except Exception as e:
            await db.rollback()
            print("Error al crear el administrador:", str(e))
            sys.exit(1)
    await engine.dispose()
    print("Conexión a la base de datos cerrada.")


if __name__ == "__main__":
    asyncio.run(create_admin())
