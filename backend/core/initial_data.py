# core/initial_data.py

from models.course_model import Course, CourseCategoryEnum
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

logger = logging.getLogger(__name__)


# Funcion asincrónica que recibe una sesión de base de datos y ejecuta la carga de cursos iniciales.
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
            "image": "https://res.cloudinary.com/dhznpt8rr/image/upload/v1754310793/Microsoft_Office_Word__2019_present.svg_coxgag.png",
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
            "image": "https://res.cloudinary.com/dhznpt8rr/image/upload/v1754310811/powerpoint_vrhff4.png",
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
            "image": "https://res.cloudinary.com/dhznpt8rr/image/upload/v1754310803/excel_crrrmw.png",
            "category": CourseCategoryEnum.OFFICE,
            "is_published": True,
            "teacher_id": 1,
        },
    ]

    # Comienza una transacción para agregar los cursos base; para que en caso de un error, deshace todos los cambios automaticamente.
    async with db.begin():
        for data in cursos_base:
            exists = await db.scalar(
                select(Course).where(Course.name == data["name"])
            )  # se usa Scalar porque solo le interesa el primer valor de la consulta, sin devolver una lista o tupla.
            if exists:
                logger.info(f"El curso '{data['name']}' ya existe.")
                continue
            try:
                cat_enum = CourseCategoryEnum(
                    data["category"]
                )  # Obtiene el enum de la categoría del curso por el que se esta pasando.
            except ValueError:
                logger.warning(
                    f"Categoría '{data['category']}' no válida. Usando OTHER."
                )
                cat_enum = CourseCategoryEnum.OTHER

            # Crea el objeto curso con los datos proporcionados
            course = Course(
                name=data["name"],
                description=data["description"],
                palette=data["palette"],
                image=data["image"],
                category=cat_enum,
                is_published=data["is_published"],
                teacher_id=data["teacher_id"],
            )
            db.add(course)  # Agrega el curso a la sesión de la base de datos.
            logger.info(f"Curso creado: {data['name']}")

    logger.info("Cursos base inicializados correctamente.")
