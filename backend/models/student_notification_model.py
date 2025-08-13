# models/student_notification_model.py
"""
Este módulo define el modelo de datos para la tabla intermedia
que registra las notificaciones enviadas a los estudiantes y si han sido leídas.
"""

# Módulos internos
from database.config_db import Base

# Módulos externos
from sqlalchemy import Table, Column, ForeignKey, Boolean, Integer

# Tabla de asociacion
student_notification = Table(
    "student_notifications",
    Base.metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column(
        "student_id",
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
    ),
    Column("notification_id", Integer, ForeignKey("notifications.id"), nullable=False),
    Column("is_read", Boolean, default=False, nullable=False),
)
