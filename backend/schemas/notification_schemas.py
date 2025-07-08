# notification_schemas.py
"""
Este módulo define los esquemas para la gestion de datos en la creacion de notificaciones usando pydantic
"""

from pydantic import BaseModel, Field


class NotificationCreate(BaseModel):
    """
    Esquema para organizar los datos que seran usados para crear las notificaciones
    """

    title: str = Field(..., max_length=200, description="Titulo de la notificación")
    message: str = Field(..., description="Mensaje detallado de la notificación")
