#student_repository.py

""" 
Este modulo contiene todas las operaciones que se le pueden atribuir a un estudiante en la base de datos.
"""

# Modulos externos
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import logging

# Modulos internos
from schemas.student_schemas import StudentRegister
from models.student_model import Student
from .utils import hash_password

logger = logging.getLogger(__name__)# Objeto para tirar logs

class StudentRepository:
    def __init__(self, db:AsyncSession) -> None:
        self.db = db
    
    async def register_student(self, email_token: str, student_schema:StudentRegister) -> Optional[Student]:
        """Permite registrar un estudiante en la base de datos.

        Args:
            student_schema (StudentRegister): Esquema que contiene y valida los datos del usuario.

        Returns:
            Optional[Student]: Estudiante creado, o None si ocurre un error.
        """
        try:
            
            # Validar si se intenta registrar un nuevo estudiante con el mismo correo
            existing_student  = await self.db.execute(select(Student).where(Student.email == student_schema.email))
            if existing_student.scalar_one_or_none():
                logger.warning("Intento de registrar estudiante duplicado: %s", student_schema.email)
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
            self.db.add(new_student) # Agregar el estudiante a la session
            await self.db.commit() # Mandar los datos del usuario a la base de datos
            await self.db.refresh(new_student) #  Sincronizar el objeto en memoria con los datos persistidos
            
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
            result = await self.db.execute(select(Student).where(Student.email_token == token))
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
    
    async def get_student_by_id(self, id:int) -> Optional[Student]:
        """Obtiene los datos del estudiante de la base de datos en base a su id.

        Args:
            id (int): Identificador unico del estudiante

        Returns:
            Optional[Student]: Objeto de tipo usuario o None en caso de error.
        """
        student_by_id = await self.db.execute(select(Student).where(Student.id == id))
        student = student_by_id.scalar_one_or_none()
        return student