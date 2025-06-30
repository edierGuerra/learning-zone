# models/student_answer_model.py
"""
Este módulo define el modelo de datos para las respuestas de los estudiantes
a las evaluaciones, incluyendo la respuesta, si es correcta y la fecha.
"""


# Módulos externos
from datetime import datetime, timezone
from sqlalchemy import (
    Integer,
    DateTime,
    Boolean,
    Table,
    Column,
    ForeignKey,
    Text,
)

# Módulos internos
from database.config_db import Base

student_answer = Table(
    "student_answers",
    Base.metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column(
        "student_id", Integer, ForeignKey("students.id"), nullable=False
    ),  # id_estudiante (foreign key)
    Column(
        "evaluation_id", Integer, ForeignKey("evaluations.id"), nullable=False
    ),  # id_evaluacion (foreign key)
    Column("student_answer", Text),  # respuesta_usuario
    Column("is_correct", Boolean),  # es_correcta (TINYINT(1))
    Column(
        "answer_date",
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    ),  # fecha_respuesta
)
