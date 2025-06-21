#services/utils/email_sender.py
""" 
Este modulo permite enviar un correo de confirmación al estudiante
"""

# Modulos externos
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

# Modulos internos

# Cargar variables de entorno
load_dotenv()

# Constantenes con información para mandar el correo
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "cjetechnologies.tech@gmail.com"
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


# Enviar correo
def send_verification_email(to_email:str, link:str):
    try:
        subject = "Verificación de correo"
        body = f"Confirma tu correo haciendo clic aquí: {link}"

        msg = MIMEMultipart()
        msg["From"] = SMTP_USER
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, to_email, msg.as_string())
        
        print(f"📤 Correo de verificación enviado a {to_email}")

    except Exception as e:
        print(f"❌ Error al enviar correo: {e}")

