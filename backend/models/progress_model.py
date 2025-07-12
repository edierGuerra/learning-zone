# models/progress_model.py
"""
Este módulo define el modelo de datos para el progreso de los estudiantes,
registrando el estado de avance de un estudiante en una lección específica.
Esta módulo sirve como tabla de asosiación.
"""

# Módulos internos
from database.config_db import Base

# Módulos externos
from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Table,
    Enum as SqlEnum,
    text,
    UniqueConstraint,
)
import enum


class StateProgress(enum.Enum):
    BLOCKED = "blocked"
    IN_PROGRESS = "in_progress"
    COMPLETE = "complete"


progress_model = Table(
    "progress",
    Base.metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("student_id", ForeignKey("students.id"), nullable=False),
    Column("lesson_id", ForeignKey("lessons.id"), nullable=False),
    Column(
        "state",
        SqlEnum(StateProgress),
        nullable=False,
        server_default=text("'blocked'"),
    ),
    UniqueConstraint("student_id", "lesson_id", name="uq_student_lesson_progress"),
)
