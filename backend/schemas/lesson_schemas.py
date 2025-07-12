# lesson_schemas.py
"""
Este módulo define esquemas de validacion y respuesta para la gestion de los datos del curso y lecciones usando la biblioteca pydantic.
"""

from pydantic import BaseModel
from typing import Optional

from models.progress_model import (
    StateProgress,
)  # Importa enum directamente desde models


class LessonResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    # Campo para el estado de la lección, que viene de la tabla progreso
    progress_state: StateProgress

    class config:
        from_attributes = True
