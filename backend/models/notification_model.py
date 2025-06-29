# models/notification_model.py
"""
Este módulo define el modelo de datos para las notificaciones generales,
incluyendo el título, mensaje y fecha de la notificación.
"""

# Módulos internos
from database.config_db import Base

# Módulos externos
from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .datetime_model import DateTime
    from .mapped_model import Mapped
    from .int_model import int
    from .str_model import str


class Notification(Base):
    __tablename__ = "notifications"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200))  # titulo
    message: Mapped[str] = mapped_column(Text)  # mensaje
    date: Mapped[DateTime] = mapped_column(DateTime)  # fecha
