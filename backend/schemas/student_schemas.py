# student_schemas.py
"""
Este módulo define esquemas de validación y respuesta para la gestión de datos de estudiantes utilizando la biblioteca pydantic.
"""

from pydantic import BaseModel, EmailStr, Field


class StudentRegister(BaseModel):
    """
    Esquema para validar los datos de registro de un nuevo estudiante.
    """

    identification_number: int = Field(
        ..., title="Número de Identificación", description="Número único del estudiante"
    )
    names: str = Field(
        ...,
        min_length=2,
        max_length=50,
        title="Nombres",
        description="Nombres del estudiante",
    )
    last_names: str = Field(
        ...,
        min_length=2,
        max_length=50,
        title="Apellidos",
        description="Apellidos del estudiante",
    )
    email: EmailStr = Field(
        ...,
        title="Correo Electrónico",
        description="Correo electrónico válido del estudiante",
    )
    password: str = Field(
        ...,
        min_length=6,
        title="Contraseña",
        description="Contraseña con mínimo 6 caracteres",
    )
    identification_id: int = Field(
        ...,
        title="Id del número de Identificación",
        description="Clave foranea del numero de identificación.",
    )


class StudentLogin(BaseModel):
    """
    Esquema para validar los datos del login del estudiante.
    """

    email: str = Field(
        ...,
        title="Correo Electronico",
        description="Correo electronico del usuario ya registrado.",
    )
    password: str = Field(
        ..., title="Contraseña", description="Contraseña del estudiante ya registrado"
    )


class StudentResponse(BaseModel):
    """
    Esquema de salida para representar un estudiante registrado (sin contraseña).
    """

    id: int = Field(..., title="ID", description="Identificador único del estudiante")
    identification_number: int = Field(..., title="Número de Identificación")
    names: str = Field(..., title="Nombres")
    last_names: str = Field(..., title="Apellidos")
    email: EmailStr = Field(..., title="Correo Electrónico")

    class Config:
        from_attributes = (
            True  # Permite que Pydantic convierta objetos ORM (como los de SQLAlchemy)
        )


# Esquema de respuesta simple para verificación o confirmaciones
class MessageResponse(BaseModel):
    message: str


class Email(BaseModel):
    email: EmailStr
