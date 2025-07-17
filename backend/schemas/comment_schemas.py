# schemas/comment_schemas.py

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class CommentCreate(BaseModel):
    course_id: int = Field(
        ..., description="ID del curso al que pertenece el comentario"
    )
    text: str = Field(
        ..., min_length=1, max_length=1000, description="Contenido del comentario"
    )
    parent_id: Optional[int] = Field(
        default=None, description="ID del comentario padre si es una respuesta"
    )
    timestamp: Optional[datetime] = Field(
        default_factory=datetime.utcnow, description="Fecha y hora de creación"
    )
