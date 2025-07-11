# repository/course_repository.py

import logging
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from models.course_model import Course
from repository.student_repository import StudentRepository

logger = logging.getLogger(__name__)  # Objeto para tirar logs


class CourseRepository:

    # Constructor con la session de la base de datos
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_courses_by_student_id(
        self, id_student: int, student_repo: StudentRepository
    ) -> List[Course]:
        """
        ## Obtener cursos por el id del estudiante

        Permite obtener una lista de cursos del estudiante en base a su id

        ### Parámetros:

        - `id_student(int)`: ID del estudiante (Su clave primaria en la base de datos)
        """
        try:
            student = await student_repo.get_student_by_id(id_student)

            if not student:
                logger.warning("[WARNING] Error al validar el estudiante [WARNING]")
                return []

            return list(student.course)

        except Exception:
            logger.warning("[ERROR] Error inesperado [ERROR]", exc_info=True)
            return []
