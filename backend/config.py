# app/config.py
''' 
Este módulo define la configuración central de la aplicación utilizando la biblioteca pydantic-settings para gestionar variables de 
entorno de forma segura y estructurada.
'''

# Modulos externos
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings): #clase de configuracion heredando BaseSettings
    # Esto le dice a Pydantic que busque el archivo .env
    '''
    Este modulo contiene la conexion al archivo .env para traer la url de la conexion a la base de datos
    '''
    model_config = SettingsConfigDict( #aca se configura como base settings cargara los valores
        env_file='.env', #le indica a pydantic que busque un archivo .env en el directorio actual
        env_file_encoding='utf-8', # codificacion del archivo .env
        extra='ignore' # Ignora variables en .env que no estén definidas aquí, solo trae lo necesario
    )

    # URL de la base de datos
    database_url: str = Field(..., env='DATABASE_URL') # 'env' especifica el nombre de la variable de entorno
    #el ... especifica que el campo es obligatorio
    #env el env sera el la variable de entorno que estara en el .env
    
    smtp_user: str = Field(..., env="SMTP_USER")
    smtp_password: str = Field(..., env="SMTP_PASSWORD")
    smtp_server: str = Field(default="smtp.gmail.com", env="SMTP_SERVER")
    smtp_port: int = Field(default=587, env="SMTP_PORT")

    # Token
    token_key: str = Field(..., env="TOKEN_KEY") #variable añadida para el token key
    token_algorithm: str = Field(default="HS256", env="TOKEN_ALGORITHM")

# Instancia de la configuración que se usará en toda la aplicación
settings = Settings()