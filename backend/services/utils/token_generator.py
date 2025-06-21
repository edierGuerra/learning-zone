#services/utils/token_generator.py

import uuid
def generate_verification_token():
    """ Permite generar un token para validar el correo. """
    return str(uuid.uuid4())
