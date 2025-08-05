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
from models.progress_model import StateProgress  # Para el enum
from models.course_model import Course
from repository.progress_repository import ProgressRepository
from repository.course_repository import CourseRepository

logger = logging.getLogger(__name__)


class LessonService:
    def __init__(
        self,
        lesson_repo: LessonRepository,
        progress_repo: ProgressRepository,
        course_repo: CourseRepository,
    ) -> None:
        self.lesson_repo = lesson_repo
        self.progress_repo = progress_repo
        self.course_repo = course_repo

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

        # Verificar si el estudiante ya tiene progreso para este curso usando ProgressRepository
        has_progress = await self.progress_repo.has_progress_for_course(
            student_id, course_id
        )

        # Si no tiene progreso, inicializarlo usando ProgressRepository
        if not has_progress:
            logger.info(
                f"Inicializando progreso para estudiante {student_id} en curso {course_id}."
            )
            await self.progress_repo.initialize_course_progress(student_id, course_id)
            # el commit ya se hace dentro de initialize_course_progress

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
                "progress_state": progress_state,  # Esto es correcto porque progress_state ya es del tipo StateProgress
            }
            response_lessons.append(LessonResponse.model_validate(lesson_data))

        return response_lessons

    async def get_count_complete_lessons(self, id_student: int = 1) -> list[dict]:
        """
        ## Obtener conteo de lecciones
        Retorna una lista de dicionarios que contienen el nombre del curso, número de lecciones completadas
        y total de lecciones por curso para un estudiante.
        """
        try:
            info_of_lessons_by_course = []

            courses: list[Course] = await self.lesson_repo.get_courses_by_student_id(
                id_student
            )

            if not courses:
                logger.warning(
                    f"No se han encontrado los cursos del estudiante con ID {id_student}"
                )
                return []

            for course in courses:
                lessons_with_progress = await self.get_course_lessons_with_progress(
                    course_id=course.id, student_id=id_student
                )

                completed = sum(
                    1
                    for lesson in lessons_with_progress
                    if lesson.progress_state == StateProgress.COMPLETE
                )
                total = len(lessons_with_progress)

                status_of_course = await self.course_repo.get_status_of_course(
                    course.id
                )

                info_of_lessons_by_course.append(
                    {
                        "id_course": course.id,
                        "name_course": course.name,
                        "status": status_of_course,
                        "completed_lessons": completed,
                        "all_lessons": total,
                        "palette": course.palette,
                    }
                )

            logger.info("Operación realizada con exito")
            return info_of_lessons_by_course
        except Exception as e:
            logger.error(
                f"Ha ocurrido un error al obtener las lecciones de los cursos: {e}",
                exc_info=True,
            )
            return []
