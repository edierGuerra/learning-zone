from models.course_model import Course, CourseCategoryEnum
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

logger = logging.getLogger(__name__)


async def create_initial_courses(db: AsyncSession):
    """
    Crea los cursos en la base de datos
    """
    cursos_base = [
        {
            "name": "Word",
            "description": "Curso de procesamiento de texto con Word",
            "palette": {
                "brand": "#2563EB",
                "surface": "#EFF6FF",
                "text": "#1E3A8A",
                "accent": "#3B82F6",
            },
            "image": "https://...svg",
            "category": CourseCategoryEnum.OFFICE,
            "is_published": True,
            "teacher_id": 1,
        },
        {
            "name": "PowerPoint",
            "description": "Curso de creación de presentaciones efectivas",
            "palette": {
                "brand": "#EA580C",
                "surface": "#FFF7ED",
                "text": "#7C2D12",
                "accent": "#FB923C",
            },
            "image": "https://...svg",
            "category": CourseCategoryEnum.OFFICE,
            "is_published": True,
            "teacher_id": 1,
        },
        {
            "name": "Excel",
            "description": "Curso de hojas de cálculo con Excel",
            "palette": {
                "brand": "#059669",
                "surface": "#ECFDF5",
                "text": "#065F46",
                "accent": "#34D399",
            },
            "image": "https://...svg",
            "category": CourseCategoryEnum.OFFICE,
            "is_published": True,
            "teacher_id": 1,
        },
    ]

    async with db.begin():
        for data in cursos_base:
            exists = await db.scalar(select(Course).where(Course.name == data["name"]))
            if exists:
                logger.info(f"El curso '{data['name']}' ya existe.")
                continue
            try:
                cat_enum = CourseCategoryEnum(data["category"])
            except ValueError:
                logger.warning(
                    f"Categoría '{data['category']}' no válida. Usando OTHER."
                )
                cat_enum = CourseCategoryEnum.OTHER
            course = Course(
                name=data["name"],
                description=data["description"],
                palette=data["palette"],
                image=data["image"],
                category=cat_enum,
                is_published=data["is_published"],
                teacher_id=data["teacher_id"],
            )
            db.add(course)
            logger.info(f"Curso creado: {data['name']}")

    logger.info("Cursos base inicializados correctamente.")
