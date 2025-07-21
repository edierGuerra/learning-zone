# schemas/evaluation_schemas.py

"""
Este módulo define esquemas de validacion y respuesta para la gestion de datos de la evaluacion usando pydantic.
"""

from pydantic import BaseModel
from typing import Optional, List

# Importa el Enum
from models.evaluation_model import QuestionType

# class EvaluationBase(BaseModel):
#     question: str
#     question_type: QuestionType

# class EvaluationOptions(BaseModel):
#     question: str
#     question_type: Literal[QuestionType.MULTIPLE_CHOICE] # Literal le dice a pydantic que esta variable solo puede tener el valor exacto que se le proporciona dentro de los corchetes
#     options: List[str]


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
