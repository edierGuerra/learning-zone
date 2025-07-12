# repository/progress_repository.py

"""
Este modulo contiene todas las operaciones que se le pueden atribuir a verificar si algun estudiante ya tiene alguna entrada de progreso
para una leccion de algun curso especifico.
Tambien se inicializa el progreso para un estudiante donde la primera leccion estara en progreso y el resto bloqueadas.
"""

# Modulos externos
import logging
from sqlalchemy import select, exists
from sqlalchemy.ext.asyncio import AsyncSession

# Modulos internos
from models.progress_model import (
    progress_model,
    StateProgress,
)  # Importa el modelo de progreso
from models.lesson_model import Lesson  # Necesario para obtener las lecciones del curso

logger = logging.getLogger(__name__)


class ProgressRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def has_progress_for_course(self, student_id: int, course_id: int) -> bool:
        """
        Verifica si el estudiante ya tiene alguna entrada de progreso
        para alguna lección dentro de un curso específico.
        """
        # Obtenemos los ID de las lecciones de ese curso
        lesson_ids_in_course_query = select(Lesson.id).where(
            Lesson.id_course == course_id
        )
        lesson_ids_in_course = (
            (await self.db.execute(lesson_ids_in_course_query)).scalars().all()
        )

        if not lesson_ids_in_course:
            return False  # Si no hay lecciones en el curso, no hay progreso posible

        # Verificamos si existe al menos una entrada de progreso para el estudiante y alguna de esas lecciones
        # Estp solo necesita burcar una, no todas.
        stmt = select(
            exists().where(
                (progress_model.c.student_id == student_id)
                & (progress_model.c.lesson_id.in_(lesson_ids_in_course))
            )
        )
        result = await self.db.execute(stmt)
        return result.scalar_one()

    async def initialize_course_progress(self, student_id: int, course_id: int) -> None:
        """
        Inicializa el progreso para un estudiante en un curso:
        la primera lección como IN_PROGRESS y el resto como BLOCKED.
        """
        try:
            # Obtener todas las lecciones del curso, ordenadas para identificar la primera
            lessons_in_course_query = (
                select(Lesson.id)
                .where(Lesson.id_course == course_id)
                .order_by(Lesson.id)
            )
            lessons_ids = (
                (await self.db.execute(lessons_in_course_query)).scalars().all()
            )

            if not lessons_ids:
                logger.warning(
                    f"No hay lecciones en el curso {course_id} para inicializar el progreso."
                )
                return

            records_to_insert = []
            first_lesson_id = lessons_ids[0]

            for lesson_id in lessons_ids:
                state = (
                    StateProgress.IN_PROGRESS
                    if lesson_id == first_lesson_id
                    else StateProgress.BLOCKED
                )
                records_to_insert.append(
                    {
                        "student_id": student_id,
                        "lesson_id": lesson_id,
                        "state": state.value,  # Almacena el valor string del Enum en la BD
                    }
                )

            if records_to_insert:
                await self.db.execute(progress_model.insert().values(records_to_insert))
                await self.db.commit()
                logger.info(
                    f"Progreso inicializado para el estudiante {student_id} en el curso {course_id}."
                )
        except Exception as e:
            logger.error(
                f"Error al iniciar el progreso para estudiante {student_id} en curso {course_id}: {e}",
                exc_info=e,
            )
            await self.db.rollback()
            raise
