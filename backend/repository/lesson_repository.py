# repository/lesson_repository.py

"""
Este modulo contiene todas las operaciones que se le pueden atribuir a obtener las lecciones de un curso junto con su progreso
en la base datos, tambien valida si el id del curso ingresado si esta en la base de datos
"""

import logging
from typing import List, Optional, Tuple  # importamos Tuple para el resultado del join

# Modulos externos
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

# Modulos internos
from models.student_model import Student
from models.lesson_model import Lesson
from models.course_model import Course
from models.progress_model import (
    progress_model,
    StateProgress,
)  # Importa el modelo progreso y el enum

logger = logging.getLogger(__name__)


class LessonRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_lessons_with_progress_by_course_id(
        self, course_id: int, student_id: int
    ) -> List[Tuple[Lesson, Optional[StateProgress]]]:
        """
        Obtiene todas las lecciones asociadas a un ID de curso específico,
        incluyendo el estado de progreso para el estudiante dado.
        Si no hay progreso para una lección, el estado será None (o 'blocked' por defecto).
        """
        try:
            # Realiza un LEFT JOIN para incluir lecciones que aún no tienen progreso registrado
            stmt = (
                select(Lesson, progress_model.c.state)
                .outerjoin(
                    progress_model,
                    (Lesson.id == progress_model.c.lesson_id)
                    & (progress_model.c.student_id == student_id),
                )
                .where(Lesson.id_course == course_id)
                .order_by(Lesson.id)  # Ordenar por id de las lecciones
            )
            result = await self.db.execute(stmt)

            # Mapea los resultados a una lista de (Lesson, StateProgress)
            lessons_with_progress = []
            for lesson_obj, progress_stare_raw in result.all():
                # Si no hay entrada de progreso, el estado por defecto es BLOCKED
                progress_state = (
                    progress_stare_raw if progress_stare_raw else StateProgress.BLOCKED
                )
                lessons_with_progress.append((lesson_obj, progress_state))

            return lessons_with_progress

        except Exception as e:
            logger.error(
                f"Error al obtener lecciones con progreso para curso {course_id} y estudiante {student_id}: {e}",
                exc_info=e,
            )
            raise  # Relanza la excepción

    async def get_course_by_id(self, course_id: int) -> Optional[Course]:
        """
        Verifica si un curso con el ID dado existe.
        Necesario para validar el id_course antes de buscar lecciones.
        """
        try:
            result = await self.db.execute(select(Course).where(Course.id == course_id))
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error al obtener curso por ID {course_id}: {e}", exc_info=e)
            raise

    async def get_courses_by_student_id(self, id_student: int = 1) -> List[Course]:
        """
        ## Selecionar cursos

        Selecciona una lista de cursos en base a el id del estudiante.

        ### Parámetros:

        - `id_student(int)`: ID del estudiante.

        ### Retorna:
        - `List[Course]`: Lista de cursos del estudiante, o lista vacía.
        """
        try:
            query = await self.db.execute(
                select(Student)
                .options(selectinload(Student.courses).selectinload(Course.lessons))
                .where(Student.id == id_student)
            )

            student = query.scalar_one_or_none()

            if not student:
                logger.warning(
                    f"[WARNING]: No se ha encontrado el estudiante con ID {id_student}."
                )
                return []
            return student.courses
        except Exception as e:
            logger.error(
                f"[ERROR]: A ocurrido un error al obtener los cursos: {e}",
                exc_info=True,
            )

    async def get_lesson_by_id_and_course_id(
        self, lesson_id: int, course_id: int
    ) -> Optional[Lesson]:
        """
        Obtiene una lección por su ID, asegurándose de que pertenezca al curso especificado.
        """
        try:
            stmt = select(Lesson).where(
                Lesson.id == lesson_id, Lesson.id_course == course_id
            )
            result = await self.db.execute(stmt)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(
                f"Error al obtener lección {lesson_id} del curso {course_id}: {e}",
                exc_info=True,
            )
            raise
