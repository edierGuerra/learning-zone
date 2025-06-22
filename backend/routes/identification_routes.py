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

@router.post("/identifications/verify", response_model=RegistrationResponse, status_code=status.HTTP_200_OK, tags=["identification"])
async def verify_identification(
    data: IdentificationCodeCheck,
    session: AsyncSession = Depends(get_session) #dar una sesión de base de datos cada vez que este endpoint se ejecute, hace que dependa de get session
    #Cuando se llame este endpoint, crea una nueva sesión de base de datos asíncrona y pásamela como session”.
    #el AsyncSession genera una conexion a base de datos de forma asincrona, permite a FastAPI y SQLAlchemy no bloquear el server
):
    """
    Verifica si un número de identificación existe en la base de datos.

    ## Parámetros:
    - `data`: Objeto con el número de identificación (`identification_code`)
    - `session`: Sesión asíncrona de SQLAlchemy (inyectada automáticamente por FastAPI)
    """
    
    return await IdentificationService.verify_code(session, data.identification_code)