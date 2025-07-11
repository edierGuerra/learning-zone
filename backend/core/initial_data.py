# app/core/initial_data.py

from models.course_model import Course
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

logger = logging.getLogger(__name__)


async def create_initial_courses(db: AsyncSession):
    """
    Crea los cursos en la base de datos
    """
    cursos_base = [
        {"name": "Word", "description": "Curso de procesamiento de texto con Word"},
        {
            "name": "PowerPoint",
            "description": "Curso de creación de presentaciones efectivas",
        },
        {"name": "Excel", "description": "Curso de hojas de cálculo con Excel"},
    ]

    for data in cursos_base:
        result = await db.execute(select(Course).where(Course.name == data["name"]))
        existing = result.scalars().first()
        if existing:
            logger.info(
                f"[INFO] El curso '{data['name']}' ya existe. No se crea de nuevo."
            )
            continue

        course = Course(name=data["name"], description=data["description"])
        db.add(course)
        logger.info(f"[INFO] Curso creado: {data['name']}")

    await db.commit()
    logger.info("[INFO] Cursos base inicializados correctamente.")
