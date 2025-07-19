# dependencies/student_dependencies.py
"""Este modulo contiene todas las dependencias listas para ser usadas en las rutas de los comentarios"""

# Modulos internos
from database.config_db import get_session

# Modulos externos
from fastapi import Depends
from repository.comment_repository import CommentRepo
from services.comment_services import CommentService
from sqlalchemy.ext.asyncio import AsyncSession


def get_comment_services(
    session: AsyncSession = Depends(get_session),
) -> CommentService:
    """Dependencia que conecta la session con el respositorio y el respositorio con el servicio.

    Args:
        session (AsyncSession, optional): Session que conecta con la base de datos. Defaults to Depends(get_session).

    Returns:
        CommentService: Objeto con el servicio del comentario.
    """
    repository = CommentRepo(session)
    return CommentService(repository)
