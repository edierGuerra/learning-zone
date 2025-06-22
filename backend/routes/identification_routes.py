#routes/identification.py

"""
Este módulo contiene las rutas relacionadas con la verificación
de códigos de identificación para el proceso de validacion de usuarios.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.config_db import get_session
from schemas.validation_schemas import IdentificationCodeCheck, RegistrationResponse
from services.identification_service import IdentificationService

# Crear el router específico para esta sección del sistema
router = APIRouter()

@router.post("/identifications/verify", response_model=RegistrationResponse, status_code=status.HTTP_200_OK, tags=["Identification"])
async def verify_identification(
    data: IdentificationCodeCheck,
    session: AsyncSession = Depends(get_session) #dar una sesión de base de datos cada vez que este endpoint se ejecute, hace que dependa de get session
    #Cuando se llame este endpoint, crea una nueva sesión de base de datos asíncrona y pásamela como session”.
    #el AsyncSession genera una conexion a base de datos de forma asincrona, permite a FastAPI y SQLAlchemy no bloquear el server
):
    """## Verificar código de identificación

    Valida si un número de identificación proporcionado existe en la base de datos.  
    Este endpoint es útil para procesos de registro u operaciones donde se necesite confirmar la existencia de un código previamente emitido.

    ### Parámetros:
    - `data (IdentificationCodeCheck)`: Objeto que contiene el código de identificación a verificar.
    - `session (AsyncSession)`: Sesión asíncrona de SQLAlchemy proporcionada automáticamente por FastAPI.  
    Se usa para realizar consultas sin bloquear el servidor.

    ### Respuesta:
    - `200 OK`: Retorna un objeto `RegistrationResponse` con el resultado de la verificación (por ejemplo, si el código es válido o no, y posiblemente más detalles según el modelo).

    ---
    *Este endpoint no crea ni modifica datos, solo realiza una verificación de existencia en la base de datos.*
    """
    
    return await IdentificationService.verify_code(session, data.identification_code)