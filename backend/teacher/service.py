import logging
from fastapi import HTTPException
from .repository import TeacherRepo
from teacher.utils import save_and_upload_file, update_file_on_cloudinary
from models.course_model import Course

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TeacherServices:
    def __init__(self, repo: TeacherRepo):
        self.repo = repo

    # --- Métodos de Cursos ---
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

    async def delete_course(self, course_id: int) -> dict:
        """
        Elimina un curso por su ID.
        :param course_id: ID del curso a eliminar.
        :return: Mensaje de confirmación.
        """
        await self.repo.delete_course(course_id)
        return {"message": "Curso eliminado exitosamente."}

    async def publish_course(self, course_id: int) -> Course:
        """
        Publica un curso por su ID.
        :param course_id: ID del curso a publicar.
        :return: Curso publicado.
        """
        return await self.repo.publish_course(course_id=course_id)

    async def filter_courses_by_category(self, category: str) -> list[Course]:
        """
        Filtra los cursos por categoría.
        :param category: Categoría por la que filtrar.
        :return: Lista de cursos filtrados.
        """
        return await self.repo.filter_courses_by_category(category)

    # --- Métodos de Profesores ---
    async def get_teacher_by_id(self, teacher_id: int):
        """
        Obtiene un profesor por su ID.
        :param teacher_id: ID del profesor.
        :return: Objeto Teacher.
        """
        return await self.repo.get_teacher_by_id(teacher_id)

    ### --- Métodos de lecciones ---

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

    async def get_lessons_by_course(self, course_id: int) -> list:
        """
        Obtiene todas las lecciones de un curso por su ID.
        :param course_id: ID del curso.
        :return: Lista de lecciones.
        """
        lessons = await self.repo.get_lessons_by_course(course_id)

        lesson_data = []
        for lesson in lessons:
            first_content = lesson.contents[0] if lesson.contents else None

            # Creamos un dict manualmente que coincida con el esquema `LessonCResponse`
            lesson_data.append(
                {
                    "id": lesson.id,
                    "name": lesson.name,
                    "content": first_content,  # Puede ser None si no tiene contenido aún
                }
            )

        return lesson_data

    # --- Métodos de Evaluaciones ---

    async def get_lesson_by_id(self, lesson_id: int):
        """
        Obtiene una lección por su ID.
        :param lesson_id: ID de la lección.
        :return: Objeto Lesson.
        """
        lesson = await self.repo.get_lesson_by_id(lesson_id)
        if not lesson:
            raise HTTPException(status_code=404, detail="Lección no encontrada")
        return lesson

    # --- Métodos de Evaluaciones ---
    async def create_evaluation(self, data: dict):
        """
        Crea una evaluación considerando el tipo de pregunta.
        Si es de opción múltiple, requiere opciones y respuesta correcta.
        Si es abierta, se ignoran las opciones y la respuesta correcta.
        """
        if data["question_type"] == "open_question":
            data["options"] = None
            data["correct_answer"] = None

        elif data["question_type"] == "multiple_choice":
            if not data.get("options") or not isinstance(data["options"], list):
                raise HTTPException(
                    status_code=400,
                    detail="Se requieren opciones válidas para preguntas de opción múltiple.",
                )
            if not data.get("correct_answer"):
                raise HTTPException(
                    status_code=400,
                    detail="Se requiere una respuesta correcta para preguntas de opción múltiple.",
                )

        return await self.repo.create_evaluation_for_lesson(data)

    async def get_evaluation_by_lesson_id(self, lesson_id: int):
        """
        Obtiene una evaluación por el ID de la lección.
        :param lesson_id: ID de la lección.
        :return: Objeto Evaluation.
        """
        evaluation = await self.repo.get_evaluation_by_lesson_id(lesson_id)
        if not evaluation:
            raise HTTPException(status_code=404, detail="Evaluación no encontrada")
        return evaluation

    async def delete_lesson(self, lesson_id: int) -> dict:
        """
        Elimina una lección por su ID.
        :param lesson_id: ID de la lección a eliminar.
        :return: Mensaje de confirmación.
        """
        await self.repo.delete_lesson(lesson_id)
        return {"message": "Lección eliminada exitosamente."}

    # --- Métodos de Notificaciones ---
    async def get_notifications_by_teacher_id(self, teacher_id: int):
        """
        Obtiene las notificaciones asociadas a un profesor.
        :param teacher_id: ID del profesor.
        :return: Lista de notificaciones.
        """
        notifications = await self.repo.get_notifications_by_teacher_id(teacher_id)
        if not notifications:
            raise HTTPException(
                status_code=404, detail="No se encontraron notificaciones."
            )
        return notifications
