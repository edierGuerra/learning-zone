# teacher/repository.py

"""Repositorio con todos los procesos"""

# Modulos externos
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
import logging

# Modulos internos
from models.course_model import Course
from models.lesson_model import Lesson
from teacher.model import Teacher
from teacher.utils import delete_file_from_cloudinary
from models.content_model import Content, TypeContent


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TeacherRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    # --- Métodos de Cursos ---
    async def create_course(self, course: dict) -> Course:
        """
        Crea un nuevo curso en la base de datos.
        :param course: Objeto Course con los detalles del curso.
        :return: El curso creado.
        """
        try:
            logger.info(f"Creando curso con los datos: {course}")
            new_course = Course(**course)
            self.db.add(new_course)
            await self.db.commit()
            await self.db.refresh(new_course)
            logger.info(f"Curso creado exitosamente con ID: {new_course.id}")
            return new_course
        except Exception as e:
            logger.error(f"Error al crear curso: {e}", exc_info=True)
            raise

    async def get_course_by_id(self, course_id: int) -> Course:
        """
        Obtiene un curso por su ID.
        :param course_id: ID del curso.
        :return: Objeto Course.
        """
        try:
            logger.info(f"Obteniendo curso con ID: {course_id}")
            result = await self.db.execute(select(Course).where(Course.id == course_id))
            course = result.scalar_one_or_none()
            if course:
                logger.info(f"Curso encontrado: {course.name}")
            else:
                logger.warning(f"Curso con ID {course_id} no encontrado.")
            return course
        except Exception as e:
            logger.error(f"Error al obtener curso: {e}", exc_info=True)
            raise

    async def update_course(self, course_id: int, course_data: dict) -> Course:
        """
        Actualiza un curso existente.
        :param course_id: ID del curso a actualizar.
        :param course_data: Datos actualizados del curso.
        :return: El curso actualizado.
        """
        stmt = select(Course).where(Course.id == course_id)
        result = await self.db.execute(stmt)
        course = result.scalar_one_or_none()

        if not course:
            logger.error(f"Curso con ID {course_id} no encontrado.")
            raise ValueError("Curso no encontrado")

        for key, value in course_data.items():
            logger.info(f"Actualizando {key} a {value} para el curso ID {course_id}")
            setattr(course, key, value)

        await self.db.commit()
        await self.db.refresh(course)
        logger.info(f"Curso ID {course_id} actualizado exitosamente.")
        return course

    async def delete_course(self, course_id: int) -> None:
        """
        Elimina un curso por su ID.
        :param course_id: ID del curso a eliminar.
        """
        stmt = select(Course).where(Course.id == course_id)
        result = await self.db.execute(stmt)
        course = result.scalar_one_or_none()

        if not course:
            logger.error(f"Curso con ID {course_id} no encontrado.")
            raise ValueError("Curso no encontrado")

        await delete_file_from_cloudinary(course.name)
        await self.db.delete(course)
        await self.db.commit()
        logger.info(f"Curso ID {course_id} eliminado exitosamente.")

    # --- Métodos de Profesores ---
    async def get_teacher_by_id(self, teacher_id: int):
        """
        Obtiene un profesor por su ID.
        :param teacher_id: ID del profesor.
        :return: Objeto Teacher.
        """
        logger.info(f"Obteniendo profesor con ID {teacher_id}")
        stmt = (
            select(Teacher)
            .options(selectinload(Teacher.courses))
            .where(Teacher.id == teacher_id)
        )
        result = await self.db.execute(stmt)
        if not result:
            logger.error(f"Profesor con ID {teacher_id} no encontrado.")
            return None
        logger.info(f"Profesor con ID {teacher_id} obtenido exitosamente.")
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
