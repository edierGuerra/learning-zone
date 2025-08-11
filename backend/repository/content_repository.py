from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import logging


from models.content_model import Content
from models.course_model import Course
from models.lesson_model import Lesson

logger = logging.getLogger(__name__)  # Objeto para tirar logs


class ContentRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_content(self, id_course: int, id_lesson: int) -> List[Content]:
        try:

            query = await self.db.execute(
                select(Course)
                .options(selectinload(Course.lessons).selectinload(Lesson.content))
                .where(Course.id == id_course)
            )

            course = query.scalar_one_or_none()

            if course:
                for lesson in course.lessons:
                    if lesson.id == id_lesson:
                        logger.info("[INFO]: Lección encontrada exitosamente.")
                        return lesson.content
            logger.warning(
                f"[WARNING]: No se ha ha podido encontrar el curso: {id_course}"
            )
            return []

        except Exception as e:
            logger.error(
                f"[ERROR]: Ha ocurrido un error al obtener el contenido: {e}",
                exc_info=True,
            )
            return []
