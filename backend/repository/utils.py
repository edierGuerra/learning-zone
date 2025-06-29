# repository/utils.py
"""Este modulo contiene funciónes adicianales para los repositorios"""

import bcrypt


def hash_password(password: str) -> bytes:
    """Permite encriptar la contraseña del estudiante

    Args:
        password (str): Contraseña en texto planto

    Returns:
        bytes: Contraseña encriptada
    """
    # Generar una sal aleatoria
    salt = bcrypt.gensalt()

    # Covertir password de texto plano a bytes
    byte_password = password.encode("utf-8")

    # Hashear la contraseña con la sal
    hashed = bcrypt.hashpw(byte_password, salt)
    return hashed


def valid_password(password: str, hash_password: str) -> bool:
    """
    # Validar contraseña

    Permite validar la contraseña ingresada por el estudiante con su contraseña real.
    Al validar la contraseña retorna un valor booleano.

    ## Parámentros:
    - `password(str)`: Contraseña ingresada por el estudiante.
    - `hash_password(str)`: Contraseña a real del estudiante.

    ## Retorno:
    - bool: True en caso de que la contraseña ingresada y la contraseña real sean iguales, de lo contrario retorna False.
    """

    # Covertir password y hash_password de texto plano a bytes
    byte_password_hashed = hash_password.encode("utf-8")
    byte_password_to_valid = password.encode("utf-8")

    # Validar la contraseña
    password_valid = bcrypt.checkpw(
        password=byte_password_to_valid, hashed_password=byte_password_hashed
    )

    # Retornar resultado boleano
    return password_valid
