#services/utils/email_sender.py
''' 
Este modulo permite enviar un correo de confirmación al estudiante
'''

# Módulos externos
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from datetime import datetime

# Módulos internos
from config import settings


# Constantes
SENDGRID_API_KEY = settings.sendgrid_api_key
EMAIL_FROM = 'no-reply@cjetechnology.org'
TEMPLATE_ID = settings.sendgrid_template_id

def send_verification_email(to_email: str, verification_link: str, student_name='Estudiante'):
    try:
        message = Mail(
            from_email=EMAIL_FROM,
            to_emails=to_email
        )
        date_now = datetime.now()
        year = date_now.year
        message.template_id = TEMPLATE_ID

        message.dynamic_template_data = {
            'student_name': student_name,
            'verification_link': verification_link,
            'current_year': year
        }

        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)

        print(f'📨 Email enviado a {to_email} (Status: {response.status_code})')

    except Exception as e:
        print(f'❌ Error al enviar correo: {e}')
