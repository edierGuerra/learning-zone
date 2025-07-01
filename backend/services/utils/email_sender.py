# services/utils/email_sender.py
"""
Este modulo permite enviar un correo de confirmación al estudiante
"""

from datetime import datetime

# Módulos internos
from config import settings

# Módulos externos
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Constantes
SENDGRID_API_KEY = settings.sendgrid_api_key
EMAIL_FROM = "no-reply@cjetechnology.org"
TEMPLATE_ID_REGISTER = settings.sendgrid_template_register_id
TEMPLATE_ID_PASSWORD = settings.sendgrid_template_password_id


def send_verification_email(
    to_email: str, verification_link: str, student_name="Estudiante"
):
    try:
        message = Mail(from_email=EMAIL_FROM, to_emails=to_email)
        date_now = datetime.now()
        year = date_now.year
        message.template_id = TEMPLATE_ID_REGISTER

        message.dynamic_template_data = {
            "student_name": student_name,
            "verification_link": verification_link,
            "current_year": year,
        }

        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)

        print(f"📨 Email enviado a {to_email} (Status: {response.status_code})")

    except Exception as e:
        print(f"❌ Error al enviar correo: {e}")


def send_password_reset_email(
    to_email: str, reset_link: str, student_name="Estudiante"
):
    """
    Envía un correo al estudiante con el enlace para restablecer su contraseña.

    Parámetros:
    - `to_email (str)`: Correo del destinatario.
    - `reset_link (str)`: Enlace para restablecer la contraseña.
    - `student_name (str)`: Nombre del estudiante (opcional).
    """
    try:
        message = Mail(from_email=EMAIL_FROM, to_emails=to_email)
        date_now = datetime.now()
        year = date_now.year

        message.template_id = TEMPLATE_ID_PASSWORD  # Asegurate que esté en tu .env

        message.dynamic_template_data = {
            "student_name": student_name,
            "reset_link": reset_link,
            "current_year": year,
        }

        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)

        print(
            f"📨 Email de recuperación enviado a {to_email} (Status: {response.status_code})"
        )

    except Exception as e:
        print(f"❌ Error al enviar correo de recuperación: {e}")
