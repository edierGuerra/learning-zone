import os
import cloudinary
from uuid import uuid4
from fastapi import UploadFile
import cloudinary.uploader

cloudinary.config(
    cloud_name="dhznpt8rr",
    api_key="315573984497752",
    api_secret="fvmAfaRGed2SuOLVNgKZxVaJlSI",
    secure=True,
)


async def save_and_upload_file(file: UploadFile, upload_folder: str = "uploads") -> str:
    """
    Guarda un archivo localmente, lo sube a Cloudinary y elimina el archivo local.
    :param file: UploadFile de FastAPI.
    :param upload_folder: Carpeta local temporal.
    :return: URL del archivo en Cloudinary.
    """
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    # Nombre único para el archivo (cero colisiones, nivel Infinity Gauntlet)
    filename = f"{uuid4().hex}_{file.filename}"
    local_path = os.path.join(upload_folder, filename)

    # Guarda el archivo localmente (la magia async/await de Starlette)
    with open(local_path, "wb") as destination:
        content = (
            await file.read()
        )  # Lee todo el archivo (cuidado con archivos MUY grandes)
        destination.write(content)

    # Sube el archivo a Cloudinary y elimina local
    try:
        result = cloudinary.uploader.upload(local_path)
        url = result.get("secure_url")
    finally:
        if os.path.exists(local_path):
            os.remove(local_path)

    return url
