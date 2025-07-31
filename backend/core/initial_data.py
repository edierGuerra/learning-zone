# app/core/initial_data.py

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
            "image": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.m.wikipedia.org%2Fwiki%2FArchivo%3AMicrosoft_Office_Word_%25282019%25E2%2580%2593present%2529.svg&psig=AOvVaw0eL8Zi0zeI0zjEpZ8BHYnB&ust=1754011350851000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJic19D35Y4DFQAAAAAdAAAAABAL",
            "category": CourseCategoryEnum.OFFICE,
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
            "image": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3AMicrosoft_Office_PowerPoint_%25282019%25E2%2580%2593present%2529.svg&psig=AOvVaw16QSAzf5g9ac1RXI0vq_Cf&ust=1754011574010000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCPirrbr45Y4DFQAAAAAdAAAAABAE",
            "category": CourseCategoryEnum.OFFICE,
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
            "image": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.m.wikipedia.org%2Fwiki%2FArchivo%3AMicrosoft_Office_Excel_%25282019%25E2%2580%2593present%2529.svg&psig=AOvVaw1veDqh4l1yHZcDF9nqxP89&ust=1754011458213000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMjgzp345Y4DFQAAAAAdAAAAABAL",
            "category": CourseCategoryEnum.OFFICE,
        },
    ]

    # for data in cursos_base:
    #     result = await db.execute(select(Course).where(Course.name == data["name"]))
    #     existing = result.scalars().first()
    #     if existing:
    #         logger.info(
    #             f"[INFO] El curso '{data['name']}' ya existe. No se crea de nuevo."
    #         )
    #         continue

    #     course = Course(
    #         name=data["name"],
    #         description=data["description"],
    #         palette=data["palette"],
    #         image=data["image"],
    #         category=data["category"])
    #     db.add(course)
    #     logger.info(f"[INFO] Curso creado: {data['name']}")

    # await db.commit()
    # logger.info("[INFO] Cursos base inicializados correctamente.")

    async with db.begin():
        for data in cursos_base:
            exists = await db.scalar(select(Course).where(Course.name == data["name"]))
            if exists:
                logger.info(f"El curso '{data['name']}' ya existe.")
                continue
            # Mapear categoría a enum
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
            )
            db.add(course)
            logger.info(f"Curso creado: {data['name']}")

    logger.info("Cursos base inicializados correctamente.")
