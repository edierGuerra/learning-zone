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
            "name": "Introducción a Word",
            "description": "Conceptos básicos y interfaz.",
        },
        {
            "course_name": "Word",
            "name": "Formato de Texto",
            "description": "Fuentes, párrafos y estilos.",
        },
        {
            "course_name": "Word",
            "name": "Tablas e Imágenes",
            "description": "Inserción y edición de elementos visuales.",
        },
        {
            "course_name": "Word",
            "name": "Impresión y Exportación",
            "description": "Configuración de impresión y guardar en PDF.",
        },
        # Lecciones para PowerPoint
        {
            "course_name": "PowerPoint",
            "name": "Primeros Pasos en PowerPoint",
            "description": "Creación de diapositivas y plantillas.",
        },
        {
            "course_name": "PowerPoint",
            "name": "Diseño y Temas",
            "description": "Personalización de la apariencia de la presentación.",
        },
        {
            "course_name": "PowerPoint",
            "name": "Animaciones y Transiciones",
            "description": "Añadir movimiento y efectos a las diapositivas.",
        },
        {
            "course_name": "PowerPoint",
            "name": "Presentación Efectiva",
            "description": "Consejos para una exposición exitosa.",
        },
        # Lecciones para Excel
        {
            "course_name": "Excel",
            "name": "Fundamentos de Excel",
            "description": "Celdas, rangos y tipos de datos.",
        },
        {
            "course_name": "Excel",
            "name": "Fórmulas y Funciones Básicas",
            "description": "Suma, promedio, contar, etc.",
        },
        {
            "course_name": "Excel",
            "name": "Gráficos y Análisis de Datos",
            "description": "Visualización de información y tablas dinámicas.",
        },
        {
            "course_name": "Excel",
            "name": "Automatización con Macros",
            "description": "Introducción a VBA y tareas repetitivas.",
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
            description=data["description"],
            id_course=course_id,  # Asignar el ID del curso
        )
        db.add(lesson)
        logger.info(
            f"[INFO] Lección creada: '{data['name']}' para el curso '{data['course_name']}'"
        )
    await db.commit()
    logger.info("[INFO] Lecciones base inicializadas correctamente.")
