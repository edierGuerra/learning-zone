# services/utils/email_validator.py
"""
Este modulo contiene la validación del correo del estudiante para que el correo ingresado sea correcto.
"""

# Modulos externos
import re

import dns.resolver


class EmailValidator:
    """
    Clase que valida el correo de un estudiante
    """

    @staticmethod
    def is_valid_format(email: str):
        """Permite validar si el formato del correo es valido"""
        return re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", email) is not None

    @staticmethod
    def has_mx_record(email: str):
        """Valida si el dominio del correo es valido"""
        try:
            domain = email.split("@")[1]
            return bool(dns.resolver.resolve(domain, "MX"))
        except Exception:
            return False

    @classmethod
    def validate_email(cls, email: str):
        """Implementa la validación del correo"""
        if not cls.is_valid_format(email):
            return False, "Formato de correo inválido"
        if not cls.has_mx_record(email):
            return False, "Dominio de correo inválido"
        return True, "Correo válido"
