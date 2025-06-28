# services/identification.services.py

from sqlalchemy.ext.asyncio import AsyncSession
from repository.identification_repository import IdentificationRepository
from schemas.validation_schemas import RegistrationResponse
from starlette import status

class IdentificationService:
    '''
        Busca un registro en la tabla 'identification' a partir del número de identificación.

        Parámetros:
        - session (AsyncSession): sesión activa de la base de datos, gestionada por FastAPI mediante Depends.
        - code (int): número de identificación que se quiere verificar.

        Retorna:
        - Un objeto tipo 'RegistrationResponse'.
    '''

    
    @staticmethod #especifica una funcion normal dentro de una clase
    async def verify_code(session: AsyncSession, code: int) -> RegistrationResponse: #esta funcion retornara los datos mediante el esquema RegistrationResponse
        identification = await IdentificationRepository.get_by_code(session, code) #aca simplemente trae el retorno del objeto que ya fue consultado en repository,
        
        if identification: #en caso de si traer el objeto carga estos datos para enviarlos
            msg='Código de identificación válido. Puede proceder con el registro.'
            can_register=True
            code_s=status.HTTP_200_OK
            identification_id=identification.id  #Devolver el ID correspondiente

        else: #en caso de que retornara None
            msg='Código de identificación no encontrado. No se puede registrar.'
            can_register=False
            code_s=status.HTTP_404_NOT_FOUND
            identification_id=None  #ID no disponible
        
        return RegistrationResponse(
        message=msg,
        can_register=can_register,
        status_code=code_s,
        identification_id=identification_id
        )