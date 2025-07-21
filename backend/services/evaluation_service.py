# services/ evaluation_service.py

import logging
from fastapi import HTTPException, status
import json

# Modulos internos
from repository.evaluation_repository import EvaluationRepository
from repository.lesson_repository import LessonRepository  # Validar curso y lección
from schemas.evaluation_schemas import (
    EvaluationResponse,
)  # Importar los esquemas de respuesta
from models.evaluation_model import QuestionType

logger = logging.getLogger(__name__)


class EvaluationService:
    def __init__(
        self, evaluation_repo: EvaluationRepository, lesson_repo: LessonRepository
    ) -> None:
        self.evaluation_repo = evaluation_repo
        self.lesson_repo = lesson_repo

    async def get_lesson_evaluation(
        self, course_id: int, lesson_id: int, student_id: int
    ) -> EvaluationResponse:
        """
        Obtiene la evaluación de una lección específica dentro de un curso dado.
        Realiza validaciones de existencia de curso y lección, y su asociación.
        """

        logger.info(
            f"Estudiante {student_id} solicitando evaluación para curso {course_id}, lección {lesson_id}"
        )

        # Validar si el curso existe
        course_exists = await self.lesson_repo.get_course_by_id(course_id)
        if not course_exists:
            logger.warning(
                f"Intento de obtener evaluación para curso inexistente: {course_id}"
            )
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Curso no encontrado."
            )

        # Validar si la lección existe y pertenece al curso
        lesson = await self.lesson_repo.get_lesson_by_id_and_course_id(
            lesson_id, course_id
        )
        if not lesson:
            logger.warning(
                f"Lección {lesson_id} no encontrada o no pertenece al curso {course_id}."
            )
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lección no encontrada en este curso.",
            )

        # Obtener la evaluación de la lección
        evaluation_obj = await self.evaluation_repo.get_evaluation_by_lesson_id(
            lesson_id
        )

        if not evaluation_obj:
            logger.warning(f"No se encontró evaluación para la lección {lesson_id}.")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Evaluación no encontrada para esta lección.",
            )

        # Transformar el objeto del modelo a un esquema Pydantic para la respuesta
        # Adaptar la respuesta según el tipo de pregunta (si tiene opciones o no)
        if evaluation_obj.question_type == QuestionType.MULTIPLE_CHOICE:
            try:
                options_list = json.loads(evaluation_obj.options)
            except json.JSONDecodeError:
                logger.error(
                    f"Error al decodificar opciones JSON para la evaluación {evaluation_obj.id}: {evaluation_obj.options}"
                )
                options_list = []

            return EvaluationResponse(
                id_evaluation=evaluation_obj.id,
                question=evaluation_obj.question,
                question_type=evaluation_obj.question_type,
                options=options_list,  # Pasar la lista de opciones
            )
        else:
            return EvaluationResponse(
                id_evaluation=evaluation_obj.id,
                question=evaluation_obj.question,
                question_type=evaluation_obj.question_type,
                options=None,
            )
