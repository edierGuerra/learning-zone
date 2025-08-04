from fastapi import HTTPException
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

    ### METODOS PARA CREAR LECCIONES ###

    async def create_lesson(self, lesson: dict, content: dict) -> dict:
        """
        Crea una nueva lección en la base de datos.
        :param lesson: Objeto Lesson con los detalles de la lección.
        :return: La lección creada.
        """

        # Validacion opcional
        if content["content_type"] != "text" and not content["file"]:
            raise HTTPException(
                status_code=400, detail="Archivo requerido para contenido multimedia."
            )

        content_url = ""
        if content.get("file"):
            content_url = await save_and_upload_file(content["file"])

        return await self.repo.create_lesson_with_content(
            name=lesson["name"],
            id_course=lesson["id_course"],
            content_data={
                "content_type": content["content_type"],
                "content": content_url,
                "text": content["text"],
            },
        )
