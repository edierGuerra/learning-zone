import logging
import os
import cloudinary
from uuid import uuid4
from fastapi import UploadFile
import cloudinary.uploader
from config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

cloudinary.config(
    cloud_name=settings.cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=settings.cloud_secure,  # Usa HTTPS si es True
)


# -- Funciones de utilidad para maneja
# r archivos y Cloudinary
async def save_and_upload_file(
    file: UploadFile, upload_folder: str = "uploads", public_id: str = None
) -> str:
    """
    Guarda un archivo localmente, lo sube a Cloudinary y elimina el archivo local.
    :param file: UploadFile de FastAPI.
    :param upload_folder: Carpeta local temporal.
    :return: URL del archivo en Cloudinary.
    """
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    # Nombre único para el archivo
    filename = f"{uuid4().hex}_{file.filename}"
    local_path = os.path.join(upload_folder, filename)

    # Guarda el archivo localmente
    with open(local_path, "wb") as destination:
        content = await file.read()  # Lee todo el archivo
        destination.write(content)

    # Sube el archivo a Cloudinary y elimina local
    try:
        result = cloudinary.uploader.upload(
            local_path, public_id=public_id, resource_type="auto"
        )
        url = result.get("secure_url")
    finally:
        if os.path.exists(local_path):
            os.remove(local_path)

    return url


async def update_file_on_cloudinary(file: UploadFile, public_id: str) -> str:
    """
    Actualiza un archivo existente en Cloudinary reemplazando el archivo con el mismo public_id.
    :param file: UploadFile de FastAPI.
    :param public_id: ID público del archivo en Cloudinary a actualizar.
    :return: URL del archivo actualizado en Cloudinary.
    """
    filename = f"{uuid4().hex}_{file.filename}"
    local_path = os.path.join("uploads", filename)

    if not os.path.exists("uploads"):
        os.makedirs("uploads")

    with open(local_path, "wb") as destination:
        content = await file.read()
        destination.write(content)

    try:
        result = cloudinary.uploader.upload(local_path, public_id=public_id)
        url = result.get("secure_url")
    finally:
        if os.path.exists(local_path):
            os.remove(local_path)

    return url


async def delete_file_from_cloudinary(
    public_id: str, resource_type: str = "image"
) -> None:
    """
    Elimina un archivo de Cloudinary usando su public_id.
    :param public_id: ID público del archivo en Cloudinary a eliminar.
    :param resource_type: Tipo de recurso ('image', 'video', 'raw', etc.). Por defecto 'image'.
    """
    try:
        # Intenta eliminar con el tipo especificado
        result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)

        # Si no se encuentra con el tipo especificado, intenta con otros tipos comunes
        if result.get("result") == "not found" and resource_type == "image":
            logger.info(
                f"No se encontró como imagen, intentando con otros tipos para: {public_id}"
            )

            # Intenta con video
            result = cloudinary.uploader.destroy(public_id, resource_type="video")
            if result.get("result") == "not found":
                # Intenta con raw (documentos, etc.)
                result = cloudinary.uploader.destroy(public_id, resource_type="raw")

        logger.info(f"Resultado de eliminación de Cloudinary: {result}")

    except Exception as e:
        logger.error(f"Error al eliminar el archivo de Cloudinary: {e}")


async def delete_file_from_cloudinary_auto(public_id: str) -> bool:
    """
    Elimina un archivo de Cloudinary detectando automáticamente el tipo de recurso.
    :param public_id: ID público del archivo en Cloudinary a eliminar.
    :return: True si se eliminó exitosamente, False en caso contrario.
    """
    resource_types = ["image", "video", "raw"]

    for resource_type in resource_types:
        try:
            result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
            if result.get("result") == "ok":
                logger.info(
                    f"Archivo eliminado exitosamente como {resource_type}: {public_id}"
                )
                return True
        except Exception as e:
            logger.warning(f"Error al intentar eliminar como {resource_type}: {e}")
            continue

    logger.error(
        f"No se pudo eliminar el archivo con ningún tipo de recurso: {public_id}"
    )
    return False


# -- Otras funciones de utilidad --
def generate_profile_prefix(name: str, last_name: str) -> str:
    """
    ## Generar prefijo

    Permite generar un prefijo en base a el nombre y el apellido del estudiante.

    ### Parámetros:
    - `name(str):` Nombre del estudiante.
    - `last_name(str)`: Apellido del estudiante.

    ### Retornos:
    - `String`: Prefijo del nombre y el apellido del estudiante.
    """

    first_letter_name: str = name[0].upper()
    first_letter_last_name: str = last_name[0].upper()

    prefix: str = first_letter_name + first_letter_last_name

    return prefix
