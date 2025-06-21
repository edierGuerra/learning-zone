# repository/utils.py
""" Este modulo contiene funciónes adicianales las que se le puden asignar a un usuario """

import bcrypt

def hash_password(password:str) -> bytes:
    """Permite encriptar la contraseña del estudiante

    Args:
        password (str): Contraseña en texto planto

    Returns:
        bytes: Contraseña encriptada
    """
    # Generar una sal aleatoria
    salt = bcrypt.gensalt()
    
    # Covertir password de texto plano a bytes
    bytes_password = password.encode("utf-8")
    
    # Hashear la contraseña con la sal
    hashed = bcrypt.hashpw(bytes_password, salt)
    return hashed