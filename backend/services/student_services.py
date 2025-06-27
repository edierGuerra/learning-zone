# services/student_services.py
''' 
Este módulo encapsula la lógica de negocio asociada a la gestión de estudiantes y sus operaciones relacionadas.
'''

# Modulos externos
from typing import Optional

from fastapi import HTTPException

# Modulos internos
from repository.student_repository import StudentRepository
from schemas.student_schemas import StudentRegister
from models.student_model import Student
from .utils.token_generator import generate_verification_token
from .utils.email_sender import send_verification_email
from .utils.email_validator import EmailValidator


class StudentService:
    def __init__(self, repository:StudentRepository) :
        self.repository = repository
    
    async def register_student(self,student_schemas:StudentRegister) -> Optional[Student]:
        '''Permite registrar un nuevo usuario.

        Args:
            student_schemas (StudentRegister): Esquema que contiene toda la información del estudiante

        Returns:
            Optional[Student]: Estudiante creado, o None si ocurre un error.
        '''
        is_valid, msg = EmailValidator.validate_email(student_schemas.email)
        if not is_valid:
            raise HTTPException(status_code=400, detail=msg)
        token = generate_verification_token()
        new_student = await self.repository.register_student(
            student_schema=student_schemas,
            email_token=token
        )
        
        if new_student:
            send_verification_email(
                to_email=student_schemas.email,
                link=f'http://localhost:5173/confirmEmai'
            )
        return new_student

    
    async def verify_email(self, token: str) -> dict:
        '''
        Verifica el correo del estudiante usando un token único.

        Args:
            token (str): Token enviado por correo.

        Returns:
            dict: Mensaje de éxito o error.
        '''
        verified = await self.repository.verify_email_token(token)
        if not verified:
            raise HTTPException(status_code=400, detail='Token inválido o expirado')

        return {'message': 'Correo verificado con éxito'}
    
    async def get_student_by_id(self, id:int) -> Optional[Student]:
        '''Obtiene un estudiante en base a su id.

        Args:
            id (int): Identificador unico del estudiante.

        Returns:
            Optional[Student]: Objeto de tipo estudiante o None en caso de que ocurra un error.
        '''
        student = await self.repository.get_student_by_id(id)
        if student is not None:
            return  student