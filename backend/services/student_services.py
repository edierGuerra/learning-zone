# services/student_services.py
""" 
Este módulo encapsula la lógica de negocio asociada a la gestión de estudiantes y sus operaciones relacionadas.
"""

# Modulos externos
from typing import Optional

# Modulos internos
from repository.student_repository import StudentRepository
from schemas.student_schemas import StudentRegister
from models.student_model import Student

class StudentService:
    def __init__(self, repository:StudentRepository) :
        self.repository = repository
    
    async def register_student(self,student_schemas:StudentRegister) -> Optional[Student]:
        """Permite registrar un nuevo usuario.

        Args:
            student_schemas (StudentRegister): Esquema que contiene toda la información del estudiante

        Returns:
            Optional[Student]: Estudiante creado, o None si ocurre un error.
        """
        new_student = await self.repository.register_student(student_schema=student_schemas)
        return new_student
