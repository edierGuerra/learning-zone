# models/student_answer_model.py
"""
Este módulo define el modelo de datos para las respuestas de los estudiantes
a las evaluaciones, incluyendo la respuesta, si es correcta y la fecha.
"""

# Módulos internos
from database.config_db import Base

# Módulos externos
from sqlalchemy import Boolean, DateTime, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .datetime_model import DateTime
    from .mapped_model import Mapped
    from .bool_model import bool
    from .int_model import int
    from .str_model import str


class StudentAnswer(Base):
    __tablename__ = "student_answers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(Integer)  # id_estudiante (foreign key)
    evaluation_id: Mapped[int] = mapped_column(Integer)  # id_evaluacion (foreign key)
    student_answer: Mapped[str] = mapped_column(Text)  # respuesta_usuario
    is_correct: Mapped[bool] = mapped_column(Boolean)  # es_correcta (TINYINT(1))
    answer_date: Mapped[DateTime] = mapped_column(DateTime)  # fecha_respuesta
