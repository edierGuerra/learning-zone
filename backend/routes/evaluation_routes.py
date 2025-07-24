# routes/evaluation_routes.py

import logging

# Modulos externos
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

# Modulos internos
from models.student_model import Student
from database.config_db import get_session
from core.security import get_current_student
from services.evaluation_service import EvaluationService, global_gemini_model
from repository.evaluation_repository import EvaluationRepository
from repository.lesson_repository import LessonRepository  # Dependencia del servicio
from schemas.evaluation_schemas import (
    APIEvaluationResponse,
)  # Esquema de respuesta
from repository.student_answer_repository import StudentAnswerRepository
from schemas.evaluation_schemas import (
    StudentAnswerRequest,
    APIEvaluationScoreResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/student/courses", tags=["Evaluations"])


# Función de dependencia para obtener el EvaluationService
def get_evaluation_service(
    db: AsyncSession = Depends(get_session),
) -> EvaluationService:
    evaluation_repo = EvaluationRepository(db)
    lesson_repo = LessonRepository(db)
    student_answer_repo = StudentAnswerRepository(db)
    # Pasa la instancia global de Gemini al servicio
    if global_gemini_model is None:
        logger.warning(
            "Intentando inicializar EvaluationService sin el modelo Gemini. Las preguntas abiertas fallarán."
        )
    return EvaluationService(
        evaluation_repo, lesson_repo, student_answer_repo, db, global_gemini_model
    )


@router.get(
    "/{id_course}/lessons/{id_lesson}/evaluation",
    status_code=status.HTTP_200_OK,
    response_model=APIEvaluationResponse,  # Define el modelo de respuesta esperado por FastAPI
)
async def get_lesson_evaluation(
    id_course: int,
    id_lesson: int,
    student: Student = Depends(get_current_student),
    evaluation_service: EvaluationService = Depends(get_evaluation_service),
):
    """
    ## Obtener Evaluación de una Lección

    Permite al estudiante autenticado obtener la evaluación asociada a una lección
    específica dentro de un curso.

    ### Parámetros de Ruta:
    - `id_course (int)`: El ID único del curso.
    - `id_lesson (int)`: El ID único de la lección.

    ### Encabezados Requeridos:
    - `Authorization: Bearer <access-token>`: Token JWT válido del estudiante autenticado.

    ### Respuestas:
    - **`200 OK`**: `application/json` - La evaluación de la lección.
      ```json
      {
        "id_evaluation": 1,
        "question": "¿Cuál es la capital de Francia?",
        "question_type": "multiple_choice",
        "options": ["Berlín", "Madrid", "París", "Roma"]
      }
      ```
      ```json
      {
        "id_evaluation": 2,
        "question": "¿Explica el concepto de fotosíntesis?",
        "question_type": "open_question",
        "options": null
      }
      ```
    - **`401 Unauthorized`**: `application/json` - Si el token de acceso es inválido o no se proporciona.
    - **`404 Not Found`**: `application/json` - Si el curso, la lección, o la evaluación no se encuentran.
    - **`500 Internal Server Error`**: `application/json` - Si ocurre un error inesperado en el servidor.
    """
    try:
        # Usamos la instancia inyectada del servicio
        # evaluation = await EvaluationService.get_lesson_evaluation(id_course, id_lesson)
        evaluation = await evaluation_service.get_lesson_evaluation(
            course_id=id_course, lesson_id=id_lesson, student_id=student.id
        )

        # FastAPI se encarga de la serialización a JSON
        return APIEvaluationResponse(
            status=status.HTTP_200_OK,
            message="Evaluacion obtenida con éxito",
            evaluation=evaluation,  # Pasamos el objeto EvaluationResponse
        )

    except HTTPException as e:
        raise e  # Propaga las excepciones HTTP controladas
    except Exception as e:
        logger.error(
            f"Error inesperado al obtener evaluación para el curso {id_course}, lección {id_lesson}: {e}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ha ocurrido un error inesperado al obtener la evaluación.",
        )


@router.post(
    "/{id_course}/lessons/{id_lesson}/evaluation/{id_evaluation}",
    status_code=status.HTTP_200_OK,
    response_model=APIEvaluationScoreResponse,
)
async def submit_lesson_evaluation(
    id_course: int,
    id_lesson: int,
    id_evaluation: int,
    answer_data: StudentAnswerRequest,
    student: Student = Depends(get_current_student),
    evaluation_service: EvaluationService = Depends(get_evaluation_service),
):
    """
    ## Enviar Respuesta de Evaluación de una Lección (POST)

    Permite al estudiante autenticado enviar su respuesta a una evaluación.
    Valida la respuesta, actualiza el progreso y devuelve un score.

    ### Parámetros de Ruta:
    - `id_course (int)`: El ID único del curso.
    - `id_lesson (int)`: El ID único de la lección.
    - `id_evaluation (int)`: El ID único de la evaluación a la que se responde.

    ### Cuerpo de la Solicitud (application/json):
    ```json
    {
      "response": "Respuesta del estudiante",
      "question_type": "open_question" // o "multiple_choice"
    }
    ```

    ### Encabezados Requeridos:
    - `Authorization: Bearer <access-token>`: Token JWT válido del estudiante autenticado.

    ### Respuestas:
    - **`200 OK`**: `application/json` - Si la respuesta es correcta y la evaluación fue pasada.
      ```json
      {
        "status": 200,
        "message": "Evaluación pasada con éxito",
        "score": {
          "old_score": 100,
          "new_score": 180,
          "date": "2025-07-22 16:30:00"
        }
      }
      ```
    - **`400 Bad Request`**: `application/json` - Si la respuesta es incorrecta o el tipo de pregunta es inconsistente.
      ```json
      {
        "status": 400,
        "message": "Respuesta incorrecta",
      }
      ```
    - **`401 Unauthorized`**: `application/json` - Si el token de acceso es inválido o no se proporciona.
    - **`404 Not Found`**: `application/json` - Si el curso, la lección, o la evaluación no se encuentran.
    - **`500 Internal Server Error`**: `application/json` - Si ocurre un error inesperado en el servidor.
    """
    try:
        response_score = await evaluation_service.evaluate_student_answer(
            course_id=id_course,
            lesson_id=id_lesson,
            evaluation_id=id_evaluation,
            student_id=student.id,
            answer_data=answer_data,
        )
        return response_score
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(
            f"Error inesperado al enviar respuesta para el curso {id_course}, lección {id_lesson}, eval {id_evaluation}, estudiante {student.id}: {e}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ha ocurrido un error inesperado al procesar la respuesta.",
        )
