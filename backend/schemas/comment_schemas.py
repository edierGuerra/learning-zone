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
    # timestamp se elimina, se genera automáticamente en el backend


class CommentResponse(BaseModel):
    id: int
    name_student: str = Field(
        ..., description="Nombre del estudiante que hizo el comentario"
    )
    text: str = Field(..., description="Texto del comentario")
    timestamp: datetime = Field(
        ..., description="Fecha y hora en que se creó el comentario"
    )
    parent_id: Optional[int] = Field(
        None, description="ID del comentario padre si es una respuesta"
    )
    course_id: int = Field(..., description="ID del curso")
    student_id: int = Field(..., description="ID del estudiante")

    class Config:
        orm_mode = True


class CommentResponseFull(BaseModel):
    comment: CommentResponse
    list_ids_connects: List[int] = Field(
        ..., description="Lista de IDs de estudiantes conectados"
    )


class CommentOut(BaseModel):
    id: int
    name_student: str = Field(
        ..., description="Nombre del estudiante que hizo el comentario"
    )
    text: str = Field(..., description="Texto del comentario")
    timestamp: datetime = Field(..., description="Fecha y hora del comentario")
    parent_id: Optional[int] = Field(
        None, description="ID del comentario padre si es una respuesta"
    )
    course_id: int = Field(..., description="ID del curso")
    student_id: int = Field(..., description="ID del estudiante autor")

    class Config:
        orm_mode = True


class CommentListResponse(BaseModel):
    comments: List[CommentOut]
    list_ids_connects: List[int] = Field(
        ..., description="Lista de IDs de estudiantes conectados"
    )


class CommentUpdate(BaseModel):
    text: str
