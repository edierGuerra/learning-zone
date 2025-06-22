# student_routes.py

"""
Este modulo contiene todas las rutas propias del estudiante.
"""

# Modulos externos
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse

# Modulos internos
from schemas.student_schemas import StudentRegister
from dependencies.student_dependencie import get_student_services
from services.student_services import StudentService
from schemas.student_schemas import StudentResponse

router = APIRouter(prefix="/api/v1/student", tags=["Students"])

@router.post("/", response_model=StudentResponse)
async def create_student(student_data:StudentRegister, services:StudentService = Depends(get_student_services)):
    """## Registrar un nuevo estudiante

    Registra un estudiante en el sistema a partir de los datos proporcionados.  
    La información recibida se valida usando el esquema `StudentRegister`.  
    Si el proceso es exitoso, se crea el estudiante y se retorna su correo electrónico.

    ### Parámetros:
    - `student_data (StudentRegister)`: Datos del estudiante, validados automáticamente mediante Pydantic.
    - `services (StudentService)`: Servicio de negocio encargado de gestionar el registro de estudiantes (inyectado con Depends).

    ### Respuesta:
    - `201 Created`: Diccionario con el campo `"email"` del estudiante recién creado.
    - `500 Internal Server Error`: Si ocurre un fallo inesperado durante el registro.

    ### Nota:
    Aunque se especifica `response_model=StudentResponse`, la función devuelve manualmente una respuesta personalizada (`JSONResponse`) con solo el correo del estudiante.
    """

    student = await services.register_student(student_data)
    if not student:
        raise HTTPException(status_code=500, detail="Error al registrar el usuario")
    return JSONResponse(content={
        "email":student.email
    },
    status_code=201)