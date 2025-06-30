# models/evaluation_model.py
"""
Este módulo define el modelo de datos para las evaluaciones o exámenes,
incluyendo las preguntas, opciones y la respuesta correcta.
"""

# Módulos internos
from database.config_db import Base

# Módulos externos
from sqlalchemy import Integer, String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .student_answer_model import student_answer

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .lesson_model import Lesson
    from .student_model import Student

# Módulos internos


class Evaluation(Base):
    __tablename__ = "evaluations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    question: Mapped[str] = mapped_column(Text)  # pregunta
    question_type: Mapped[str] = mapped_column(String(50))  # tipo
    options: Mapped[str] = mapped_column(Text)  # opciones
    correct_answer: Mapped[str] = mapped_column(Text)  # respuesta_correcta
    lesson_id: Mapped[int] = mapped_column(Integer)  # id_leccion (foreign key)

    # claves foraneas
    id_leccion: Mapped[int] = mapped_column(
        ForeignKey("lessons.id"), unique=True, nullable=False
    )

    # relaciones
    lesson: Mapped["Lesson"] = relationship(back_populates="evaluation")
    students: Mapped["Student"] = relationship(
        back_populates="evaluations", secondary=student_answer
    )
