# dependencies/student_dependencies.py
"""Este modulo contiene todas las dependencias listas para ser asignadas usadas en las rutas del usuario"""

# Modulos internos
from database.config_db import get_session

# Modulos externos
from fastapi import Depends
from repository.student_repository import StudentRepository
from services.student_services import StudentService
from sqlalchemy.ext.asyncio import AsyncSession


def get_student_services(
    session: AsyncSession = Depends(get_session),
) -> StudentService:
    """Dependencia que conecta la session con el respositorio y el respositorio con el servicio.

    Args:
        session (AsyncSession, optional): Session que conecta con la base de datos. Defaults to Depends(get_session).

    Returns:
        StudentService: Objeto con el servicio del estudiante.
    """
    repository = StudentRepository(session)
    return StudentService(repository)
