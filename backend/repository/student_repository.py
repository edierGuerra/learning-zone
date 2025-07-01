# student_repository.py

"""
Este modulo contiene todas las operaciones que se le pueden atribuir a un estudiante en la base de datos.
"""

import logging
from typing import Optional
from datetime import datetime

from models.student_model import Student

# Modulos internos
from schemas.student_schemas import StudentRegister

# Modulos externos
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .utils import hash_password, valid_password

logger = logging.getLogger(__name__)  # Objeto para tirar logs


class StudentRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def register_student(
        self, email_token: str, student_schema: StudentRegister
    ) -> Optional[Student]:
        """Permite registrar un estudiante en la base de datos.

        Args:
            student_schema (StudentRegister): Esquema que contiene y valida los datos del usuario.

        Returns:
            Optional[Student]: Estudiante creado, o None si ocurre un error.
        """
        try:

            # Validar si se intenta registrar un nuevo estudiante con el mismo correo
            existing_student = await self.db.execute(
                select(Student).where(Student.email == student_schema.email)
            )
            if existing_student.scalar_one_or_none():
                logger.warning(
                    "Intento de registrar estudiante duplicado: %s",
                    student_schema.email,
                )
                return None

            # Copia de los datos del estudiante
            student_data = student_schema.model_dump()

            # Hashear la contraseña
            hashed_password = hash_password(student_data["password"]).decode("utf-8")

            # Elimina el password original para evitar el conflicto
            student_data.pop("password")

            # Objeto del nuevo estudiante
            new_student = Student(
                **student_data,
                password=hashed_password,
                email_token=email_token,
                is_verified=False
            )

            # Agregar el usuario a la base de datos
            self.db.add(new_student)  # Agregar el estudiante a la session
            await self.db.commit()  # Mandar los datos del usuario a la base de datos
            await self.db.refresh(
                new_student
            )  #  Sincronizar el objeto en memoria con los datos persistidos

            # Retornar el objeto del estudiante
            return new_student

        # Manejar excepciones y evitar que los datos lleguen a la base de datos cuando ocurra un error.
        except Exception as e:
            logger.error("Error al registrar el estudiante", exc_info=e)
            await self.db.rollback()
            return None

    async def verify_email_token(self, token: str) -> bool:
        """
        Verifica el token del correo y activa la cuenta del estudiante.

        Args:
            token (str): Token recibido por correo.

        Returns:
            bool: True si se verificó correctamente, False en caso contrario.
        """
        try:
            result = await self.db.execute(
                select(Student).where(Student.email_token == token)
            )
            student = result.scalar_one_or_none()

            if not student:
                logger.warning("Token de verificación inválido: %s", token)
                return False

            student.is_verified = True
            student.email_token = None  # Evita que se reutilice el token

            await self.db.commit()
            return True

        except Exception as e:
            logger.error("Error al verificar token de correo", exc_info=e)
            await self.db.rollback()
            return False

    async def get_student_by_id(self, id: int) -> Optional[Student]:
        """Obtiene los datos del estudiante de la base de datos en base a su id.

        Args:
            id (int): Identificador unico del estudiante

        Returns:
            Optional[Student]: Objeto de tipo usuario o None en caso de error.
        """
        student_by_id = await self.db.execute(select(Student).where(Student.id == id))
        student = student_by_id.scalar_one_or_none()
        return student

    async def valid_student(
        self, user_email: str, user_password: str
    ) -> Optional[Student]:
        """
        ## Validar correo del estudiante

        Busca un estudiante en la base de datos por medio de su correo y valida su contraseña.

        ### Parámentros:
        - `email(str)`: Correo del estudiante con el que sera validado.
        - `password(str)`: Contraseña ingresada por el estudiante.

        ### Retornos:
        - `Optional[Student]`: Objeto de tipo estudiante, en caso de error None
        """
        try:
            # Buscar el estudiane por medio de su correo
            result = await self.db.execute(
                select(Student).where(Student.email == user_email)
            )
            student = result.scalar_one_or_none()

            # Lanzar error y retornar None en caso de no encontrar el estudiante por medio del correo
            if not student:
                logger.warning("⚠️ Correo de estudiante no encontrado: %s", user_email)
                return None

            # Validar la contraseña
            validate_password = valid_password(
                password=user_password, hash_password=student.password
            )

            if validate_password is False:
                logger.warning("⚠️ La contraseña ingresada no coincide ⚠️")
                return None
            elif student.is_verified is False:
                logger.warning("⚠️ La cuenta del usuario no se encuentra activa ⚠️")
                return None
            elif validate_password:
                logger.info("✅Se ha validado correcatemente al usuario✅")
                return student

        except Exception as e:
            logger.error("⛔ Error al validar el correo del estudiante ⛔ ", exc_info=e)
            return None

    async def recovery_password(
        self, email: str, password_token: str, expire_password_token: datetime
    ) -> Optional[Student]:
        """
        ## Recuperar contraseña

        Este metodo permite acualizar los atributos del estudiante agregando el password_token y el expire_password_token.

        ### Parámentros:

        - `email(str)`: Correo del estudiante que desea recuperar su contraseña.
        - `password_token(str)`: Token que le permitira al usuario cambiar su contraseña.
        - `expire_password_token(str)`: Tiempo en el que expira el token para cambiar contraseña.

        ### Returnos:

        - `Optional[Student]`: Objeto de tipo estudiante o None en caso de error.
        """
        try:
            # Obtener estudiante por medio del correo
            query = await self.db.execute(select(Student).where(Student.email == email))
            student = query.scalar_one_or_none()

            # Ejecutar en caso de que el correo del estudiante sea valido
            if student:
                # Acutalizar los datos del estudiante con el token de recuperación de contraseña y su tiempo de expiración
                student.password_token = password_token
                student.expire_password_token = expire_password_token
                await self.db.commit()
                await self.db.refresh(student)
                return student
            # Ejecutar en caso de que el correo no sea valido
            elif student is None:
                logger.warning("⚠️ Error al validar al usuario ⚠️")
                return None
        # Exepción en caso de que halla un error
        except Exception as e:
            logger.error("⛔ Error al intentar recuperar la contraseña ⛔ ", exc_info=e)
            return None
