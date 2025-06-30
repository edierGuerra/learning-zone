# models/notification_model.py
"""
Este módulo define el modelo de datos para las notificaciones generales,
incluyendo el título, mensaje y fecha de la notificación.
"""


# Módulos externos
from sqlalchemy import Integer, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

# Módulos internos
from database.config_db import Base
from .student_notification_model import student_notification

# Módulos externos

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .student_model import Student


class Notification(Base):
    __tablename__ = "notifications"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200))  # titulo
    message: Mapped[str] = mapped_column(Text)  # mensaje
    date: Mapped[DateTime] = mapped_column(DateTime)  # fecha

    # Relaciones
    students: Mapped[List["Student"]] = relationship(
        secondary=student_notification, back_populates="notifications"
    )
