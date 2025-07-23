from models.content_model import Content, TypeContent
from models.lesson_model import Lesson
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

logger = logging.getLogger(__name__)


async def create_initial_contents(db: AsyncSession):
    """
    Crea contenidos iniciales tipo imagen asociados a las lecciones,
    usando IDs reales a partir del nombre de la lección.
    """
    # Obtener todas las lecciones existentes
    result = await db.execute(select(Lesson.id, Lesson.name))
    lesson_rows = result.all()

    if not lesson_rows:
        logger.warning("[WARNING] No se encontraron lecciones en la base de datos.")
        return

    # Mapeo: nombre de la lección → id
    lesson_name_to_id = {name: id_ for id_, name in lesson_rows}

    # Contenidos base con tipo de contenido 'image' y descripción obligatoria 'text'
    contents_base = [
        {
            "lesson_name": "Introducción y entorno de trabajo en Word",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/introduction_word.png",
            "text": """Microsoft Word es un programa para crear y editar documentos de texto. Cuando abres Word, lo primero que ves es su entorno de trabajo, donde están las herramientas para escribir, dar formato y organizar tu documento. Conocer cada parte te ayudará a usar Word con confianza y rapidez.Cinta de opciones: Dar formato y organizar textosBarra de herramientas de acceso rápido: Contiene comandos frecuentes para guardar y deshacerÁrea de trabajo: Pate central donde aparece la hoja en blanco y donde escribes, editas y visualizas tu documentoBarra de estado : Muestra información útil como el número de página actual, el total de páginas, el conteo de palabras, el idioma y opciones para cambiar la vista o el zoom.""",
        },
        {
            "lesson_name": "Crear, guardar y abrir documentos",
            "content_type": TypeContent.IMAGE,
            "content": "https://example.com/img/word-guardar.png",
            "text": "Guardado de documentos",
        },
        {
            "lesson_name": "Formato de texto",
            "content_type": TypeContent.IMAGE,
            "content": "https://example.com/img/word-formato.png",
            "text": "Formato de texto en Word",
        },
        {
            "lesson_name": "Párrafos y listas",
            "content_type": TypeContent.IMAGE,
            "content": "https://example.com/img/word-parrafos.png",
            "text": "Estructuración con listas",
        },
        {
            "lesson_name": "Primeros Pasos en PowerPoint",
            "content_type": TypeContent.IMAGE,
            "content": "https://example.com/img/ppt-intro.png",
            "text": "Interfaz inicial de PowerPoint",
        },
        {
            "lesson_name": "Diseño y Temas",
            "content_type": TypeContent.IMAGE,
            "content": "https://example.com/img/ppt-diseno.png",
            "text": "Aplicación de temas",
        },
        {
            "lesson_name": "Animaciones y Transiciones",
            "content_type": TypeContent.IMAGE,
            "content": "https://example.com/img/ppt-animaciones.png",
            "text": "Ejemplo de transición",
        },
        {
            "lesson_name": "Presentación Efectiva",
            "content_type": TypeContent.IMAGE,
            "content": "https://example.com/img/ppt-presentacion.png",
            "text": "Tips de presentación",
        },
        {
            "lesson_name": "Fundamentos de Excel",
            "content_type": TypeContent.IMAGE,
            "content": "https://example.com/img/excel-fundamentos.png",
            "text": "Ventana principal de Excel",
        },
        {
            "lesson_name": "Fórmulas y Funciones Básicas",
            "content_type": TypeContent.IMAGE,
            "content": "https://example.com/img/excel-formulas.png",
            "text": "Uso de SUMA y PROMEDIO",
        },
        {
            "lesson_name": "Gráficos y Análisis de Datos",
            "content_type": TypeContent.IMAGE,
            "content": "https://example.com/img/excel-graficos.png",
            "text": "Gráficos en Excel",
        },
        {
            "lesson_name": "Automatización con Macros",
            "content_type": TypeContent.IMAGE,
            "content": "https://example.com/img/excel-macros.png",
            "text": "Ejemplo básico de macro",
        },
    ]

    for data in contents_base:
        lesson_name = data["lesson_name"]
        lesson_id = lesson_name_to_id.get(lesson_name)

        if lesson_id is None:
            logger.warning(
                f"[WARNING] Lección '{lesson_name}' no encontrada. Saltando contenido."
            )
            continue

        # Verificar si el contenido ya existe (por URL e ID de lección)
        result = await db.execute(
            select(Content).where(
                (Content.content == data["content"]) & (Content.lesson_id == lesson_id)
            )
        )
        existing = result.scalars().first()

        if existing:
            logger.info(
                f"[INFO] Contenido ya existe para la lección '{lesson_name}'. No se crea de nuevo."
            )
            continue

        content = Content(
            content_type=data["content_type"],
            content=data["content"],
            text=data["text"],
            lesson_id=lesson_id,
        )
        db.add(content)
        logger.info(
            f"[INFO] Contenido creado (tipo imagen) para la lección '{lesson_name}'."
        )

    await db.commit()
    logger.info("[INFO] Contenidos tipo imagen inicializados correctamente.")
