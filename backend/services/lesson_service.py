# services/lesson_service.py

"""
Este módulo encapsula la lógica de negocio asociada a la operación y obtencion de las lecciones y sus estados transformandolos
es un modelo de respuesta del esquema LessonResponse validando primero si el curso existe
"""

# Modulos externos

import logging
from typing import List
from fastapi import HTTPException, status

# Modulos internos

from repository.lesson_repository import LessonRepository
from schemas.lesson_schemas import (
    LessonResponse,
)  # Importamos el esquemna de respuesta de la leccion

# from models.progress_model import StateProgress #para usar el enum

logger = logging.getLogger(__name__)


class LessonService:
    def __init__(self, lesson_repo: LessonRepository) -> None:
        self.lesson_repo = lesson_repo

    async def get_course_lessons_with_progress(
        self, course_id: int, student_id: int
    ) -> List[LessonResponse]:
        """
        Obtiene las lecciones para un curso dado, incluyendo el estado de progreso
        para un estudiante específico, validando la existencia del curso.
        """
        # Validar si el curso existe
        course_exists = await self.lesson_repo.get_course_by_id(course_id)
        if not course_exists:
            logger.warning(
                f"Intento de obtener lecciones para curso inexistente: {course_id}"
            )
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Curso no encontrado."
            )

        # Obtener las lecciones y su progreso del repositorio
        lessons_and_progress = (
            await self.lesson_repo.get_lessons_with_progress_by_course_id(
                course_id, student_id
            )
        )

        # Transformar los objetos del modelo a esquemas Pydantic para la respuesta
        response_lessons: List[LessonResponse] = []
        for lesson_obj, progress_state in lessons_and_progress:
            lesson_data = {
                "id": lesson_obj.id,
                "name": lesson_obj.name,
                "description": lesson_obj.description,
                "progress_state": progress_state,  # Esto es correcto porque progress_state ya es del tipo StateProgress
            }
            response_lessons.append(LessonResponse.model_validate(lesson_data))

        return response_lessons
