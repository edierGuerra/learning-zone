from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from services.utils.email_validator import EmailValidator
from services.student_services import StudentService
from dependencies.student_dependencie import get_student_services

router = APIRouter(prefix="/api/v1/student/password", tags=["Password"])


@router.get("/forgot")
async def forgot_password(
    email_student: str, services: StudentService = Depends(get_student_services)
):
    """
    ## Recuperar contraseña (solicitud de restablecimiento)

    Esta ruta permite iniciar el proceso de recuperación de contraseña para un estudiante,
    validando su correo electrónico. Si el correo es válido y pertenece a un usuario registrado,
    se enviará un enlace de restablecimiento a dicho correo.

    ⚠️ Por razones de seguridad, la respuesta es genérica, sin confirmar si el correo está registrado o no.

    ### Parámetros:
    - **email_student** (`str`): Correo electrónico del estudiante que solicita la recuperación de contraseña.
    - **services** (`StudentService`): Servicio de lógica de negocio para la gestión del estudiante (inyectado con `Depends`).

    ### Respuesta:
    - **200 OK**:
        ```json
        {
          "message": "Si tu correo esta registrado, recibiras un enlace para restablecer tu contraseña"
        }
        ```
        Independientemente de si el correo está registrado, la respuesta es siempre la misma para proteger la privacidad del usuario.

    - **400 Bad Request**:
        Si el correo no cumple con el formato adecuado.
        ```json
        {
          "detail": "Correo electrónico inválido"
        }
        ```

    - **500 Internal Server Error**: Si ocurre un error inesperado en el proceso de recuperación.

    ### Nota:
    Esta ruta **no envía directamente** el enlace de restablecimiento, sino que delega esta tarea al servicio `recovery_password`.
    """
    is_valid, msg = EmailValidator.validate_email(email_student)
    if not is_valid:
        raise HTTPException(status_code=400, detail=msg)
    student = await services.recovery_password(email=email_student)
    if student:
        return JSONResponse(
            content={
                "message": "Si tu correo esta registrado, recibiras un enlace para restablecer tu contraseña"
            }
        )


@router.post("/reset")
async def reset_password(
    new_password: str, services: StudentService = Depends(get_student_services)
):
    pass
