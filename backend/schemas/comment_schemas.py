# schemas/comment_schemas.py

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


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


class CommentResponse(BaseModel):
    id: int
    nameStudent: str = Field(
        ..., description="Nombre del estudiante que hizo el comentario"
    )
    text: str = Field(..., description="Texto del comentario")
    timestamp: datetime = Field(
        ..., description="Fecha y hora en que se creó el comentario"
    )
    parentId: Optional[int] = Field(None, alias="parentId")
    courseId: int = Field(..., alias="courseId")
    studentId: int = Field(..., alias="studentId")

    class Config:
        allow_population_by_field_name = True
        orm_mode = True


class CommentResponseFull(BaseModel):
    comment: CommentResponse
    listIdsConnects: List[int] = Field(
        ..., description="Lista de IDs de estudiantes conectados"
    )


class CommentOut(BaseModel):
    id: int
    nameStudent: str = Field(
        ..., description="Nombre del estudiante que hizo el comentario"
    )
    text: str = Field(..., description="Texto del comentario")
    timestamp: datetime = Field(..., description="Fecha y hora del comentario")
    parentId: Optional[int] = Field(
        None, description="ID del comentario padre si es una respuesta"
    )
    courseId: int = Field(..., description="ID del curso")
    studentId: int = Field(..., description="ID del estudiante autor")

    class Config:
        orm_mode = True


class CommentListResponse(BaseModel):
    comments: List[CommentOut]
