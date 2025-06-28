#services/utils/email_sender.py
""" 
Este modulo permite enviar un correo de confirmación al estudiante
"""

# Modulos externos
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import settings


# Enviar correo
def send_verification_email(to_email:str, link:str):
    try:
        subject = "Verificación de correo"
        body = f"Confirma tu correo haciendo clic aquí: {link}"

        msg = MIMEMultipart()
        msg["From"] = settings.smtp_user
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(settings.smtp_server,settings.smtp_port) as server:
            server.starttls()
            server.login(settings.smtp_user,settings.smtp_password)
            server.sendmail(settings.smtp_user, to_email, msg.as_string())
        
        print(f"📤 Correo de verificación enviado a {to_email}")

    except Exception as e:
        print(f"❌ Error al enviar correo: {e}")

