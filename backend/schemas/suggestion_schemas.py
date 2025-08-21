from pydantic import BaseModel, EmailStr, Field


class SuggestionCreate(BaseModel):
    sender: str = Field(..., description="Nombre o identificador del remitente")
    type_suggestion: str = Field(..., description="Tipo o título de la sugerencia")
    content_message: str = Field(..., description="Contenido de la sugerencia")
    to_email: EmailStr = Field(
        "cjetechnologies.tech@gmail.com",
        description="Correo destino (por defecto el de soporte)",
    )
