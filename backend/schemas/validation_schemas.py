# schemas/validation.py

""" 
Este módulo incluye un conjunto completo de esquemas diseñados para la validación precisa y eficiente del número de identificación del 
usuario, garantizando cumplimiento y seguridad en el proceso.
"""

from pydantic import BaseModel, Field
from typing import Optional

# ... (tus esquemas existentes de Student y Identification) ...

class IdentificationCodeCheck(BaseModel):
    """
    Esquema para validar la existencia de un código de identificación.
    """
    identification_code: int = Field(..., description="Código de identificación a verificar.", ge=1000000000, le=9999999999   # Valor debe ser de 10 digitos
) #aca va el codigo de identificacion que se va a verificar 

class RegistrationResponse(BaseModel):
    """
    Esquema para la respuesta de la API sobre la posibilidad de registro.
    """
    message: str
    can_register: bool
    status_code: int # Para reflejar el código HTTP en la respuesta JSON
    identification_id: Optional[int] = None  # Cambio para envio de numero de identificacion