# repository/lesson_repository.py

"""
Este modulo contiene todas las operaciones que se le pueden atribuir a obtener las lecciones de un curso junto con su progreso
en la base datos, tambien valida si el id del curso ingresado si esta en la base de datos
"""

import logging
from typing import List, Optional, Tuple  # importamos Tuple para el resultado del join

# Modulos externos
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

# Modulos internos
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
                f"Error al obtener lecciones con progresso para curso {course_id} y estudiante {student_id}: {e}",
                exc_info=e,
            )
            raise  # Relanza la excepción

    async def get_course_by_id(self, course_id: int) -> Optional[Course]:
        """
        Verifica si un curso con el ID dado existe.
        Necesario para validar el id_course antes de buscar lecciones.
        """
        try:
            result = await self.db.execute(select(Course).where(course_id == course_id))
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error al obtener curso por ID {course_id}: {e}", exc_info=e)
            raise
