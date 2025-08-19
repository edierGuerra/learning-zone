"""Contiene las dependencias para el modulo de profesor"""

from .service import TeacherServices
from .repository import TeacherRepo
from repository.student_answer_repository import StudentAnswerRepository

from database.config_db import get_session

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends


def get_teacher_services(
    session: AsyncSession = Depends(get_session),
) -> TeacherServices:
    repo = TeacherRepo(session)
    student_answer_repo = StudentAnswerRepository(session)
    return TeacherServices(repo, student_answer_repo)
