import logging
from .repository import TeacherRepo
from teacher.utils import save_and_upload_file, update_file_on_cloudinary
from models.course_model import Course

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TeacherServices:
    def __init__(self, repo: TeacherRepo):
        self.repo = repo

    async def create_course(self, course: dict) -> dict:
        """
        Crea un nuevo curso en la base de datos.
        :param course: Objeto Course con los detalles del curso.
        :return: El curso creado.
        """
        # Guardar imagen en cloudinary
        if "image" in course:
            course["image"] = await save_and_upload_file(
                course["image"], public_id=course["name"]
            )

        return await self.repo.create_course(course)

    async def get_course_by_id(self, course_id: int) -> Course:
        """
        Obtiene un curso por su ID.
        :param course_id: ID del curso.
        :return: Objeto Course.
        """
        return await self.repo.get_course_by_id(course_id)

    async def update_course(
        self, course_id: int, course_data: dict, public_id: str
    ) -> dict:
        """
        Actualiza un curso existente.
        :param course_id: ID del curso a actualizar.
        :param course_data: Datos actualizados del curso.
        :return: El curso actualizado.
        """
        if "image" in course_data:
            logger.info(f"Actualizando imagen del curso con ID {course_id}")
            logger.info(f"Datos del curso a actualizar: {course_data}")
            logger.info(f"Public ID para la imagen: {public_id}")
            course_data["image"] = await update_file_on_cloudinary(
                course_data["image"], public_id=public_id
            )
        return await self.repo.update_course(course_id, course_data)

    async def get_teacher_by_id(self, teacher_id: int):
        """
        Obtiene un profesor por su ID.
        :param teacher_id: ID del profesor.
        :return: Objeto Teacher.
        """
        return await self.repo.get_teacher_by_id(teacher_id)
