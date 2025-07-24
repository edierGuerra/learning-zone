# schemas/evaluation_schemas.py

"""
Este módulo define esquemas de validacion y respuesta para la gestion de datos de la evaluacion usando pydantic.
"""

from pydantic import BaseModel, Field
from typing import Optional, List

# Importa el Enum
from models.evaluation_model import QuestionType


class EvaluationResponse(BaseModel):
    """
    Esquema de respuesta prara una evaluación de leccion.
    Se adapta si tiene opciones o no.
    """

    id_evaluation: int
    question: str
    question_type: QuestionType  # <--- Ahora es el Enum
    options: Optional[List[str]] = None

    class Config:
        from_attributes = True  # Permite crear el modelo desde un objeto ORM
        use_enum_values = True  # Le dice a Pydantic que serialice el Enum a su valor (string) cuando se convierte a JSON.


class APIEvaluationResponse(BaseModel):
    """
    Esquema de respuesta estándar para las solicitudes de evaluación,
    incluyendo un status, un mensaje y el objeto de evaluación.
    """

    status: int = Field(..., description="Código de estado HTTP de la respuesta.")
    message: str = Field(..., description="Mensaje descriptivo de la respuesta.")
    evaluation: EvaluationResponse = Field(
        ..., description="El objeto de evaluación solicitado."
    )


# Segunda parte


# Esquema para la entrada de la respuesta del estudiante (POST)
class StudentAnswerRequest(BaseModel):
    response: str = Field(..., description="La respuesta del estudiante a la pregunta.")
    question_type: QuestionType = Field(
        ..., description="El tipo de pregunta a la que se responde."
    )


# Esquema para la respuesta de la API después de validar la respuesta del estudiante (POST)
class ScoreResponseDetails(BaseModel):
    old_score: int = Field(
        ..., description="Puntaje acumulado del estudiante antes de esta evaluación."
    )
    new_score: int = Field(
        ..., description="Puntaje total del estudiante después de esta evaluación."
    )
    date: str = Field(
        ...,
        description="Fecha y hora de la evaluación (formato 'YYYY-MM-DD HH:MM:SS').",
    )


class APIEvaluationScoreResponse(BaseModel):
    status: int = Field(..., description="Codigo de estado HTTP de la respuesta.")
    message: str = Field(..., description="Mensaje descriptivo de la respuesta.")
    score: Optional[ScoreResponseDetails] = Field(
        None, description="Detalles del puntaje, si la evaluación fue pasada."
    )
