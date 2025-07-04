# router.recovery_password_router.py

from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.responses import JSONResponse
from schemas.student_schemas import StudentNewPassword
from services.utils.email_validator import EmailValidator
from services.student_services import StudentService
from dependencies.student_dependencie import get_student_services

router = APIRouter(prefix="/api/v1/student/password", tags=["Password"])


@router.post("/forgot")
async def forgot_password(
    email_student: str = Header(),
    services: StudentService = Depends(get_student_services),
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


@router.post("/reset")  # se usa post para acciones que modifican datos
async def reset_password_confirm(
    new_pass_data: StudentNewPassword,
    services: StudentService = Depends(get_student_services),
):
    """
    ## Restablecer Contraseña (Confirmación)

    Esta ruta permite a un estudiante establecer una nueva contraseña utilizando un token
    de recuperación previamente enviado a su correo electrónico.

    ### Parámetros:
    - **new_pass_data** (`StudentNewPassword`): Objeto Pydantic que contiene el token de recuperación
      y la nueva contraseña.
    - **services** (`StudentService`): Servicio de lógica de negocio para la gestión del estudiante (inyectado con `Depends`).

    ### Respuesta:
    - **200 OK**: Contraseña restablecida exitosamente.
        ```json
        {
          "message": "Contraseña restablecida exitosamente."
        }
        ```
    - **400 Bad Request**: Token inválido, expirado o nueva contraseña no cumple los requisitos.
        ```json
        {
          "detail": "Token inválido o expirado."
        }
        ```
    - **500 Internal Server Error**: Si ocurre un error inesperado al actualizar la contraseña.
    """
    response = await services.reset_student_password(new_pass_data)

    # si el servicio no lanzo una excepcion, significa que fue exitoso
    return JSONResponse(content=response, status_code=status.HTTP_200_OK)
