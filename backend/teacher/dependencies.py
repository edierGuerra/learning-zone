""" Contiene las dependencias para el modulo de profesor """

from service import TeacherServices
from repository import TeachaerRepo
from database.config_db import get_session

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends


def get_teacher_services(
    session: AsyncSession = Depends(get_session),
) -> TeacherServices:
    repo = TeachaerRepo(session)
    return TeacherServices(repo)
