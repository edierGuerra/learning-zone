#models/notification_model.py
'''
Este módulo define el modelo de datos para las notificaciones generales,
incluyendo el título, mensaje y fecha de la notificación.
'''

# Módulos externos
from sqlalchemy import Integer, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column

# Módulos internos
from database.config_db import Base

class Notification(Base):
    __tablename__ = 'notifications'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200)) # titulo
    message: Mapped[str] = mapped_column(Text) # mensaje
    date: Mapped[DateTime] = mapped_column(DateTime) # fecha