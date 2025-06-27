#core/security.py


# Modulos externos
from datetime import datetime, timedelta, timezone

from jose import jwt
from config import Settings #modulo de donde se conecta al archivo .env

ALGORITHM = "HS256"
def encode_access_token(payload:dict, exp_time:int = 3600) -> str:
    """  
    Codifica un token de acceso.

    Args:
        payload(dict): Diccionario con la data que sera codificada
        exp_time(int): Tiempo de expiración del token expresado en segundos, por defecto 3600

    Returns:
        token(str): El token ya encriptado con la información del usuario

    """
    # Copia de pyload
    to_encode = payload.copy()

    # Tiempo de emisión 
    issued_at = datetime.now(timezone.utc)
    to_encode["iat"] = int(issued_at.timestamp())

    # Tiempo de expiración
    expiration_time = issued_at + timedelta(seconds=exp_time)
    to_encode["exp"] = int(expiration_time.timestamp())

    # Configruacion del token
    token = jwt.encode(to_encode,Settings.token_key,ALGORITHM)
    return token