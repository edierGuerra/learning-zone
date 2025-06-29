# models/evaluation_model.py
"""
Este módulo define el modelo de datos para las evaluaciones o exámenes,
incluyendo las preguntas, opciones y la respuesta correcta.
"""

# Módulos internos
from database.config_db import Base

# Módulos externos
from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class Evaluation(Base):
    __tablename__ = "evaluations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    question: Mapped[str] = mapped_column(Text)  # pregunta
    question_type: Mapped[str] = mapped_column(String(50))  # tipo
    options: Mapped[str] = mapped_column(Text)  # opciones
    correct_answer: Mapped[str] = mapped_column(Text)  # respuesta_correcta
    lesson_id: Mapped[int] = mapped_column(Integer)  # id_leccion (foreign key)
