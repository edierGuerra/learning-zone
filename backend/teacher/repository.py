"""Repositorio con todos los procesos"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.course_model import Course
from teacher.model import Teacher


class TeacherRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_course(self, course: dict) -> Course:
        """
        Crea un nuevo curso en la base de datos.
        :param course: Objeto Course con los detalles del curso.
        :return: El curso creado.
        """
        new_course = Course(**course)
        self.db.add(new_course)
        await self.db.commit()
        await self.db.refresh(new_course)
        return new_course

    async def get_teacher_by_id(self, teacher_id: int):
        """
        Obtiene un profesor por su ID.
        :param teacher_id: ID del profesor.
        :return: Objeto Teacher.
        """
        stmt = select(Teacher).where(Teacher.id == teacher_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
