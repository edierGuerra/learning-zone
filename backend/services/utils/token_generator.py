# services/utils/token_generator.py

import uuid


def generate_verification_token():
    """Permite generar un token."""
    return str(uuid.uuid4())
