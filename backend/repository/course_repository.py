# repository/course_repository.py

import logging

from sqlalchemy import update, select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from models.course_model import Course
from models.course_student_model import CourseStudentAssociation, StateCourse
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
            courses = []

            if not student:
                logger.warning("[WARNING] Error al validar el estudiante [WARNING]")
                return []
            for course in student.courses:
                query = await self.db.execute(
                    select(CourseStudentAssociation).where(
                        CourseStudentAssociation.course_id == course.id,
                        CourseStudentAssociation.student_id == id_student,
                    )
                )
                status_course = query.scalar_one_or_none()
                courses.append(
                    {
                        "id": course.id,
                        "name": course.name,
                        "description": course.description,
                        "image": course.image,
                        "category": course.category,
                        "palette": course.palette,
                        "status": status_course.status,
                    }
                )
            return list(courses)

        except Exception:
            logger.warning("[ERROR] Error inesperado [ERROR]", exc_info=True)
            return []

    async def mark_course_as_completed_for_student(
        self, student_id: int, course_id: int
    ):
        """
        Actualiza el estado de un curso a 'completed' para un estudiante específico.
        """
        stmt = (
            update(CourseStudentAssociation)
            .where(
                CourseStudentAssociation.student_id == student_id,
                CourseStudentAssociation.course_id == course_id,
            )
            .values(status=StateCourse.COMPLETED)
        )
        await self.db.execute(stmt)
        # el commit se hará en el servicio que llama a esta función

    async def get_course_status_for_student(
        self, student_id: int, course_id: int
    ) -> StateCourse:
        """
        Obtiene el estado de progreso de un curso para un estudiante.
        """
        stmt = select(CourseStudentAssociation.status).where(
            CourseStudentAssociation.student_id == student_id,
            CourseStudentAssociation.course_id == course_id,
        )
        result = await self.db.execute(stmt)
        status = result.scalar_one_or_none()
        return status if status else StateCourse.IN_PROGRESS

    async def get_status_of_course(self, id_course: int):
        query = await self.db.execute(
            select(CourseStudentAssociation).where(
                CourseStudentAssociation.course_id == id_course
            )
        )
        status_course = query.scalar_one_or_none()
        return status_course.status
