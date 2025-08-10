# notification_schemas.py
"""
Este módulo define los esquemas para la gestion de datos en la creacion de notificaciones usando pydantic
"""

from pydantic import BaseModel, Field
from datetime import datetime


class NotificationCreate(BaseModel):
    """
    Esquema para organizar los datos que seran usados para crear las notificaciones
    """

    title: str = Field(..., max_length=200, description="Titulo de la notificación")
    message: str = Field(..., description="Mensaje detallado de la notificación")


class NotificationResponse(BaseModel):
    """
    Esquema de respuesta para una notificación
    """

    id: int = Field(..., description="ID único de la notificación")
    title: str = Field(..., description="Título de la notificación")
    message: str = Field(..., description="Mensaje de la notificación")
    date: datetime = Field(..., description="Fecha y hora de la notificación")
    teacher_id: int = Field(..., description="ID del profesor que creó la notificación")

    class Config:
        from_attributes = True  # Para compatibilidad con Pydantic v2
