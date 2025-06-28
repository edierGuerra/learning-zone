#services/utils/email_sender.py
''' 
Este modulo permite enviar un correo de confirmación al estudiante
'''

# Modulos externos
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os

# Cargar variables de entorno
load_dotenv()

# Constantes
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
EMAIL_FROM = 'no-reply@cjetechnology.org'
TEMPLATE_ID = os.getenv('SENDGRID_TEMPLATE_ID')

def send_verification_email(to_email: str, verification_link: str, student_name='Estudiante'):
    try:
        message = Mail(
            from_email=EMAIL_FROM,
            to_emails=to_email
        )

        message.template_id = TEMPLATE_ID

        message.dynamic_template_data = {
            'student_name': student_name,
            'verification_link': verification_link,
            'current_year': 2025
        }

        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)

        print(f'📨 Email enviado a {to_email} (Status: {response.status_code})')

    except Exception as e:
        print(f'❌ Error al enviar correo: {e}')
