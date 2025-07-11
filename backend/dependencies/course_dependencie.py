# dependencies/student_dependencies.py
"""Este modulo contiene todas las dependencias listas para ser asignadas usadas en las rutas del curso"""

# Modulos internos
from database.config_db import get_session

# Modulos externos
from fastapi import Depends
from repository.course_repository import CourseRepository
from services.course_services import CourseServices
from repository.student_repository import StudentRepository
from sqlalchemy.ext.asyncio import AsyncSession


def get_course_services(
    session: AsyncSession = Depends(get_session),
) -> CourseServices:

    course_repository = CourseRepository(session)
    student_repository = StudentRepository(session)
    return CourseServices(course_repository, student_repository)
