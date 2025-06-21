# student_routes.py

"""
Este modulo contiene todas las rutas propias del estudiante.
"""

# Modulos externos
from fastapi import APIRouter, Depends

# Modulos internos
from schemas.student_schemas import StudentRegister
from dependencies.student_dependencie import get_student_services
from services.student_services import StudentService
from schemas.student_schemas import StudentResponse

router = APIRouter(prefix="/api/v1/student", tags=["Students"])

@router.post("/", response_model=StudentResponse, summary="Registrar estudiante", description="Facilita el registro de un nuevo estudiante en la base de datos, validando y almacenando los datos proporcionados de forma segura.")
async def create_student(student_data:StudentRegister, services:StudentService = Depends(get_student_services)):
    """Crea un nuevo estudiante a partir de los datos proporcionados.

    Esta ruta permite registrar un nuevo estudiante en el sistema. Se valida la información recibida usando el esquema
    `StudentRegister` y, si es válida, se almacena de forma segura en la base de datos. Devuelve los datos del estudiante
    recién creado sin incluir información sensible como la contraseña.

    Args:
        student_data (StudentRegister): Información del estudiante validada mediante Pydantic.
        services (StudentService): Dependencia que encapsula la lógica de negocio para estudiantes.

    Returns:
        StudentResponse: Representación del estudiante registrado.
    """

    student = await services.register_student(student_data)
    return student