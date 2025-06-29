# student_routes.py

'''
Este modulo contiene todas las rutas propias del estudiante.
'''

# Modulos externos
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

# Modulos internos
from models.student_model import Student
from schemas.student_schemas import StudentRegister, StudentResponse, StudentLogin
from dependencies.student_dependencie import get_student_services
from services.student_services import StudentService
from core.security import encode_access_token, get_current_student

router = APIRouter(prefix='/api/v1/student', tags=['Students'])

@router.post('/', response_model=StudentResponse)
async def create_student(student_data:StudentRegister, services:StudentService = Depends(get_student_services)):
    '''## Registrar un nuevo estudiante

    Registra un estudiante en el sistema a partir de los datos proporcionados.  
    La información recibida se valida usando el esquema `StudentRegister`.  
    Si el proceso es exitoso, se crea el estudiante y se retorna su correo electrónico.

    ### Parámetros:
    - `student_data (StudentRegister)`: Datos del estudiante, validados automáticamente mediante Pydantic.
    - `services (StudentService)`: Servicio de negocio encargado de gestionar el registro de estudiantes (inyectado con Depends).

    ### Respuesta:
    - `201 Created`: Diccionario con el campo `'email'` del estudiante recién creado.
    - `500 Internal Server Error`: Si ocurre un fallo inesperado durante el registro.

    ### Nota:
    Aunque se especifica `response_model=StudentResponse`, la función devuelve manualmente una respuesta personalizada (`JSONResponse`) con solo el correo del estudiante.
    '''

    student = await services.register_student(student_data)
    if not student:
        raise HTTPException(status_code=500, detail='Error al registrar el usuario')
    return JSONResponse(content={
        'email':student.email
    },
    status_code=201)
    
@router.get('/verify_email')
async def verify_email_token(email_token:str,id_student:int, service:StudentService = Depends(get_student_services)):
    ''' 
    ## Verificación de correo electrónico de un estudiante.

    Esta ruta valida el correo electrónico de un usuario usando un token de verificación. 
    Si el token es válido y el usuario existe, se genera un token de acceso (JWT).

    ### Parámetros:
    - `email_token(str)`: Token enviado al correo del usuario para validación.
    - `id_student(int)`: ID del usuario en la base de datos.

    ### Respuesta:
    - `200 OK` con un token de acceso y los datos básicos del estudiante si todo es válido.
    - Otro código de estado si ocurre algún fallo en la verificación o búsqueda del usuario.
    '''
    token_valid = await service.verify_email(token=email_token)
    if token_valid:
        student = await service.get_student_by_id(id_student)
        if student:
            student_pyload = {
                'sub':str(student.id)
            }
            token = encode_access_token(student_pyload)
            return JSONResponse(
                content={
                    'access_token': token,
                    'token_type':'bearer',
                    'is_active':student.is_verified,
                    'names_student':student.names
                    },
                status_code=200
            )
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Ha ocurrido un error en el servidor.')

@router.get('/', response_model=StudentResponse)
async def get_student(student:Student = Depends(get_current_student)):
    ''' 
    ## Obtener estudiante
    
    Ruta que permite obtener los datos del estudiante por medio de su token.
    
    ### Parámetros:
    - `student(Student)`: Objeto de tipo estudiante obtenido al validar el `token`
    '''
    try:
        return student
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Error inesperado en el servidor :(')

@router.post('/login')
async def login_student(student_login:StudentLogin,services:StudentService = Depends(get_student_services)):
    """
    ## Iniciar Sesión de Estudiante

    Permite a un estudiante autenticarse en el sistema utilizando su correo electrónico y contraseña.
    Si las credenciales son válidas, se genera y retorna un token de acceso JWT.

    ### Parámetros:
    - `student_login (schemas.student_schemas.StudentLogin)`: Objeto que contiene las credenciales del estudiante (`email` y `password`) para el inicio de sesión.
    - `services (services.student_services.StudentService)`: Instancia del servicio de estudiantes inyectada para manejar la lógica de negocio.

    ### Respuestas:
    - **`200 OK`**: `application/json` - Inicio de sesión exitoso.
        Retorna un objeto JSON con el token de acceso JWT y su tipo.
        ```json
        {
          "access_token": "eyJ...",
          "token_type": "bearer",
          "message": "Inicio de sesión exitoso"
        }
        ```
    - **`401 Unauthorized`**: `application/json` - Credenciales inválidas.
        Se lanza si el correo electrónico o la contraseña proporcionados son incorrectos.
        ```json
        {
          "detail": "Correo o contraseña incorrectos"
        }
        ```
    - **`500 Internal Server Error`**: `application/json` - Errores internos del servidor.
        Puede ocurrir en dos escenarios:
        1.  **Error al generar el token:** Si el servidor no puede crear el token JWT por alguna razón interna.
            ```json
            {
              "detail": "Error al generar el token"
            }
            ```
        2.  **Error desconocido:** Cualquier otra excepción inesperada durante el proceso de login.
            ```json
            {
              "detail": "Error desconocido"
            }
            ```
    """
    try:
        student = await services.valid_student(password=student_login.password, email=student_login.email)
        if student is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Correo o contraseña incorrectos")
        elif student is not None:
            to_encode = {
                'sub':str(student.id)
            }
            access_token = encode_access_token(payload=to_encode)
            if not access_token:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Error al generar el token')
            return JSONResponse(
                content={
                    'access_token': access_token,
                    'token_type': 'bearer',
                    'message':'Inicio de sesión exitoso'
                },
                status_code=status.HTTP_200_OK
            )
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error desconosido")
