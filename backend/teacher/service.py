from .repository import TeacherRepo
from teacher.utils import save_and_upload_file


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
            course["image"] = await save_and_upload_file(course["image"])

        return await self.repo.create_course(course)

    async def get_teacher_by_id(self, teacher_id: int):
        """
        Obtiene un profesor por su ID.
        :param teacher_id: ID del profesor.
        :return: Objeto Teacher.
        """
        return await self.repo.get_teacher_by_id(teacher_id)
