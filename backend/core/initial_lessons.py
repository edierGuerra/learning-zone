# /core/initial_lessons.py

from models.lesson_model import Lesson
from models.course_model import Course  # Modelo de curso para buscar IDs
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

logger = logging.getLogger(__name__)


async def create_initial_lessons(db: AsyncSession):
    """
    Crea las lecciones iniciales en la base de datos y las asocia a los cursos existentes.
    """
    # Obtener los ids de los cursos existentes
    # para asociar las lecciones correctamente
    course_data = {}
    result = await db.execute(select(Course.id, Course.name))
    for course_id, course_name in result.all():
        course_data[course_name] = course_id

    if not course_data:
        logger.warning(
            "[WARNING] No se encontraron cursos en la base de datos. No se pueden crear lecciones."
        )
        return

    # Definir las lecciones base, asociandolas por el nombre del curso
    lessons_base = [
        # Lecciones para Word
        {
            "course_name": "Word",
            "name": "Introducción y entorno de trabajo en Word",
        },
        {
            "course_name": "Word",
            "name": "Crear, guardar y abrir documentos",
        },
        {
            "course_name": "Word",
            "name": "Formato de texto",
        },
        {
            "course_name": "Word",
            "name": "Párrafos y listas",
        },
        # Lecciones para PowerPoint
        {
            "course_name": "PowerPoint",
            "name": "Primeros Pasos en PowerPoint",
        },
        {
            "course_name": "PowerPoint",
            "name": "Diseño y Temas",
        },
        {
            "course_name": "PowerPoint",
            "name": "Animaciones y Transiciones",
        },
        {
            "course_name": "PowerPoint",
            "name": "Presentación Efectiva",
        },
        # Lecciones para Excel
        {
            "course_name": "Excel",
            "name": "Fundamentos de Excel",
        },
        {
            "course_name": "Excel",
            "name": "Fórmulas y Funciones Básicas",
        },
        {
            "course_name": "Excel",
            "name": "Gráficos y Análisis de Datos",
        },
        {
            "course_name": "Excel",
            "name": "Automatización con Macros",
        },
    ]

    # Iterar y crear las lecciones
    for data in lessons_base:
        course_id = course_data.get(data["course_name"])
        if course_id is None:
            logger.warning(
                f"[WARNING] Curso '{data['course_name']}' no encontrado para la lección '{data['name']}'. Saltando."
            )

            # Verificar si la lección ya existe para este curso
        result = await db.execute(
            select(Lesson).where(
                (Lesson.name == data["name"])
                & (Lesson.id_course == course_id)  # verificar también el id del curso
            )
        )
        existing = result.scalars().first()

        if existing:
            logger.info(
                f"[INFO] La lección '{data['name']}' para el curso '{data['course_name']}' ya existe. No se crea de nuevo."
            )
            continue

        lesson = Lesson(
            name=data["name"],
            id_course=course_id,  # Asignar el ID del curso
        )
        db.add(lesson)
        logger.info(
            f"[INFO] Lección creada: '{data['name']}' para el curso '{data['course_name']}'"
        )
    await db.commit()
    logger.info("[INFO] Lecciones base inicializadas correctamente.")
