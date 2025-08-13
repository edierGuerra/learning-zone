# models/student_answer_model.py
"""
Este módulo define el modelo de datos para las respuestas de los estudiantes
a las evaluaciones, incluyendo la respuesta, si es correcta y la fecha.
Ahora es una entidad propia para almacenar el detalle de cada respuesta
"""


# Módulos externos
from datetime import datetime, timezone
from sqlalchemy import Integer, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING

# Módulos internos
from database.config_db import Base

if TYPE_CHECKING:
    from .student_model import Student
    from .evaluation_model import Evaluation


class StudentAnswer(Base):
    __tablename__ = "student_answers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), nullable=False
    )
    evaluation_id: Mapped[int] = mapped_column(
        ForeignKey("evaluations.id"), nullable=False
    )

    student_response: Mapped[str] = mapped_column(
        Text, nullable=False
    )  # Respuesta del estudiante
    score: Mapped[float] = mapped_column(
        Float, nullable=True
    )  # Score de la respuesta, puede ser nulo si no se evalua
    answered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),  # Usar DateTime con timezone para consistencia
        default=lambda: datetime.now(timezone.utc),
    )

    # Relaciones con los modelos Student y Evaluation
    student: Mapped["Student"] = relationship(back_populates="student_answers_rel")
    evaluation: Mapped["Evaluation"] = relationship(
        back_populates="student_answers_rel"
    )
