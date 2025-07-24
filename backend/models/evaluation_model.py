# models/evaluation_model.py
"""
Este módulo define el modelo de datos para las evaluaciones o exámenes,
incluyendo las preguntas, opciones y la respuesta correcta.
"""

# Módulos internos
from database.config_db import Base

# Módulos externos
from sqlalchemy import Integer, Text, ForeignKey, Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .lesson_model import Lesson
    from .student_answer_model import StudentAnswer

# Módulos internos


class QuestionType(str, Enum):
    """
    Define los tipos posibles para una pregunta de evaluación.
    """

    MULTIPLE_CHOICE = "multiple_choice"
    OPEN_QUESTION = "open_question"


class Evaluation(Base):
    __tablename__ = "evaluations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    question: Mapped[str] = mapped_column(Text)  # pregunta
    question_type: Mapped[QuestionType] = mapped_column(
        SqlEnum(QuestionType, name="question_type_enum", create_type=True),
        nullable=False,
    )  # tipo, 'name' es el nombre del tipo de la BD
    options: Mapped[str] = mapped_column(Text, nullable=True)  # opciones
    correct_answer: Mapped[str] = mapped_column(
        Text, nullable=True
    )  # respuesta_correcta

    # claves foraneas
    id_leccion: Mapped[int] = mapped_column(
        ForeignKey("lessons.id"), unique=True, nullable=False
    )

    # relaciones
    lesson: Mapped["Lesson"] = relationship(back_populates="evaluation")
    student_answers_rel: Mapped[list["StudentAnswer"]] = relationship(
        back_populates="evaluation"
    )
