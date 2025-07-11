# models/content_model.py
"""
Este módulo define el modelo de datos para los contenidos de las lecciones,
como videos o documentos, incluyendo su tipo y URL.
"""

# Módulos internos
from database.config_db import Base

# Módulos externos
from sqlalchemy import ForeignKey, Integer, Enum as SqlEnum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .lesson_model import Lesson


class TypeContent(enum.Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"


class Content(Base):
    __tablename__ = "contents"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    # content_type: Mapped[str] = mapped_column(String(50))  # tipo
    content_type: Mapped[TypeContent] = mapped_column(
        SqlEnum(TypeContent), nullable=False, default=TypeContent.TEXT
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)

    # Claves foraneas
    lesson_id: Mapped[int] = mapped_column(
        ForeignKey("lessons.id")
    )  # id_leccion (foreign key)

    # Relaciones
    lesson: Mapped["Lesson"] = relationship(back_populates="contents")
