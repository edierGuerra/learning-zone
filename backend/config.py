# config.py
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings): #clase de configuracion heredando BaseSettings
    # Esto le dice a Pydantic que busque el archivo .env
    """
    este modulo contiene la conexion al archivo .env para traer la url de la conexion a la base de datos
    """
    model_config = SettingsConfigDict( #aca se configura como base settings cargara los valores
        env_file='.env', #le indica a pydantic que busque un archivo .env en el directorio actual
        env_file_encoding='utf-8', # codificacion del archivo .env
        extra='ignore' # Ignora variables en .env que no estén definidas aquí, solo trae lo necesario
    )

    # URL de la base de datos
    database_url: str = Field(..., env="DATABASE_URL") # 'env' especifica el nombre de la variable de entorno
    #el ... especifica que el campo es obligatorio
    #env el env sera el la variable de entorno que estara en el .env

# Instancia de la configuración que se usará en toda la aplicación
settings = Settings()