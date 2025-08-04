# teacher/repository.py

"""Repositorio con todos los procesos"""

# Modulos externos
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

# Modulos internos
from models.course_model import Course
from models.lesson_model import Lesson
from teacher.model import Teacher
from models.content_model import Content, TypeContent


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

    async def create_lesson_with_content(
        self, name: str, id_course: int, content_data: dict
    ):
        """
        Crea una nueva lección en la base de datos.
        :param lesson: Objeto Lesson con los detalles de la lección.
        :return: None
        """
        new_lesson = Lesson(name=name, id_course=id_course)
        self.db.add(new_lesson)
        await self.db.flush()  # Permite obtener el ID antes de commit

        new_content = Content(
            lesson_id=new_lesson.id,
            content_type=TypeContent(content_data["content_type"]),
            content=content_data["content"],
            text=content_data["text"],
        )
        self.db.add(new_content)

        await self.db.commit()
        await self.db.refresh(new_lesson)
        return new_lesson
