# routes/lesson_routes.py

"""
Este módulo contiene las rutas relacionadas con las lecciones de un curso del estudiante.
Incluye funcionalides para obtener las lecciones de un curso junto con sus estados.
"""

import logging

# Modulos externos
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

# Modulos internos
from database.config_db import get_session
from core.security import get_current_student  # Devuelve el objeto del estudiante
from repository.lesson_repository import LessonRepository
from services.lesson_service import LessonService
from models.student_model import Student  # Necesario para el tipo "student" en Depends

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/student/courses", tags=["Lessons"])


def get_lesson_service(db: AsyncSession = Depends(get_session)) -> LessonService:
    lesson_repo = LessonRepository(db)
    return LessonService(lesson_repo)


@router.get("/{id_course}/lessons", status_code=status.HTTP_200_OK)
async def get_course_lessons(
    id_course: int,
    # Obtiene el objeto Student completo del token
    student: Student = Depends(get_current_student),
    lesson_service: LessonService = Depends(get_lesson_service),
):
    """
    ## Obtener Lecciones de un Curso con Estado de Progreso

    Permite al estudiante autenticado obtener la lista de lecciones de un curso
    específico, incluyendo el estado de progreso individual de cada lección
    para ese estudiante. Si es la primera vez que el estudiante accede a las
    lecciones de este curso, se inicializará su progreso: la primera lección
    se marcará como 'IN_PROGRESS' y las demás como 'BLOCKED'.

    ### Parámetros:
    - `id_course (int)`: **Parámetro de ruta**. El ID único del curso del cual se desean obtener las lecciones.
    - `student (models.student_model.Student)`: Objeto del estudiante autenticado, inyectado
      automáticamente por la dependencia `get_current_student` (validación de `Authorization: Bearer <token>`).

    ### Encabezados Requeridos:
    - `Authorization: Bearer <access-token>`: Token JWT válido del estudiante autenticado.

    ### Respuestas:
    - **`200 OK`**: `application/json` - Lista de lecciones del curso con sus estados de progreso.
        Retorna un mensaje de éxito y una lista de objetos `LessonResponse`, cada uno conteniendo
        `id`, `name`, `description`, y `progress_state` (que será 'blocked', 'in_progress' o 'complete').
        ```json
        {
          "message": "Lecciones obtenidas exitosamente.",
          "lessons": [
            {
              "id": 1,
              "name": "Introducción a Excel",
              "description": "Conceptos básicos de la hoja de cálculo.",
              "progress_state": "in_progress" # Esta es la primera lección
            },
            {
              "id": 2,
              "name": "Fórmulas y Funciones",
              "description": "Uso de funciones comunes en Excel.",
              "progress_state": "blocked" # Las demás, si no tienen progreso, son bloqueadas
            },
            {
              "id": 3,
              "name": "Tablas Dinámicas",
              "description": "Análisis de datos con tablas dinámicas.",
              "progress_state": "blocked"
            }
          ]
        }
        ```
    - **`401 Unauthorized`**: `application/json` - Si el token de acceso es inválido o no se proporciona.
        ```json
        {
          "detail": "Credenciales no válidas"
        }
        ```
    - **`404 Not Found`**: `application/json` - Si el `id_course` proporcionado no corresponde a un curso existente.
        ```json
        {
          "detail": "Curso no encontrado."
        }
        ```
    - **`500 Internal Server Error`**: `application/json` - Si ocurre un error inesperado en el servidor.
        ```json
        {
          "detail": "Ha ocurrido un error inesperado al obtener las lecciones."
        }
        ```
    """

    try:
        # Pasa el Id del estudiante (obtenido del token) y el ID del curso al servicio
        lessons_with_progress = await lesson_service.get_course_lessons_with_progress(
            id_course, student.id
        )

        return JSONResponse(
            content={
                "message": "Lecciones obtenidas exitosamente.",
                "lessons": [lesson.model_dump() for lesson in lessons_with_progress],
            },
            status_code=status.HTTP_200_OK,
        )
    except Exception as e:
        raise e
    except Exception as e:
        logger.error(
            f"Error inesperado al obtener lecciones del curso {id_course}: {e}",
            exc_info=e,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ha ocurrido un error inesperado al obtener las lecciones.",
        )


@router.get("/lessons")
async def get_count_lessons_complete(
    student: Student = Depends(get_current_student),
    lesson_service: LessonService = Depends(get_lesson_service),
):
    """
    ## Obtener cantidad de lecciones por curso

    Retorna una lista con el nombre de cada curso, el total de lecciones y cuántas ha completado un estudiante.

    ### Parámetros:
    - `student` (Student): Objeto de tipo estudiante extraido en base al token del mismo.

    ### Retorna:
    - Lista de diccionarios con las claves: `name_course`, `completed_lessons` y `all_lessons`.
    """
    return await lesson_service.get_count_complete_lessons(id_student=student.id)
