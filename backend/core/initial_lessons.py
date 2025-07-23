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
        {
            "course_name": "Word",
            "name": "Insertar y dar formato a tablas",
        },
        {
            "course_name": "Word",
            "name": "Insertar imágenes, formas e iconos",
        },
        {
            "course_name": "Word",
            "name": "Encabezados, pies de página y numeración",
        },
        {
            "course_name": "Word",
            "name": "Bordes y sombreados",
        },
        {
            "course_name": "Word",
            "name": "Diseño de página: márgenes, tamaño y orientación",
        },
        {
            "course_name": "Word",
            "name": "Estilos y temas rápidos",
        },
        {
            "course_name": "Word",
            "name": "Aplicar columnas de texto",
        },
        {
            "course_name": "Word",
            "name": "Insertar enlaces, notas al pie y marcadores",
        },
        {
            "course_name": "Word",
            "name": "Uso del panel de navegación y búsqueda",
        },
        {
            "course_name": "Word",
            "name": "Combinación de correspondencia (mail merge)",
        },
        {
            "course_name": "Word",
            "name": "Crear índice o tabla de contenido",
        },
        {
            "course_name": "Word",
            "name": "Revisar ortografía y sinónimos",
        },
        {
            "course_name": "Word",
            "name": "Control de cambios y comentarios",
        },
        {
            "course_name": "Word",
            "name": "Protección y restricción del documento",
        },
        {
            "course_name": "Word",
            "name": "Imprimir y guardar o exportar como PDF ",
        },
        {
            "course_name": "Word",
            "name": "Atajos de teclado básicos en Word",
        },
        {
            "course_name": "Word",
            "name": " Uso de plantillas en Word",
        },
        {
            "course_name": "Word",
            "name": " Insertar gráficos y SmartArt",
        },
        # Lecciones para Excel
        {
            "course_name": "Excel",
            "name": "Introducción y entorno de trabajo en Excel",
        },
        {
            "course_name": "Excel",
            "name": "Modificar datos",
        },
        {
            "course_name": "Excel",
            "name": "Seleccionar y autorrellenar",
        },
        {
            "course_name": "Excel",
            "name": "Copiar y Pegar (básico)",
        },
        {
            "course_name": "Excel",
            "name": "Copiar y pegar (especial)",
        },
        {
            "course_name": "Excel",
            "name": "Insertar, mover hojas y eliminar hojas",
        },
        {
            "course_name": "Excel",
            "name": "Formato condicional",
        },
        {
            "course_name": "Excel",
            "name": "Formatos numéricos clave",
        },
        {
            "course_name": "Excel",
            "name": "Jerarquía de operadores",
        },
        {
            "course_name": "Excel",
            "name": "Referencias absolutas ($)",
        },
        {
            "course_name": "Excel",
            "name": "Función SUMA",
        },
        {
            "course_name": "Excel",
            "name": "PROMEDIO, CONTAR, MAX, MIN",
        },
        {
            "course_name": "Excel",
            "name": "Ordenar Datos",
        },
        {
            "course_name": "Excel",
            "name": "Filtrar datos",
        },
        {
            "course_name": "Excel",
            "name": "Crear un gráfico",
        },
        {
            "course_name": "Excel",
            "name": "Función SI (IF)",
        },
        {
            "course_name": "Excel",
            "name": "Función BUSCARV (VLOOKUP)",
        },
        {
            "course_name": "Excel",
            "name": "Crear listas desplegables",
        },
        {
            "course_name": "Excel",
            "name": "Convertir un rango en tabla",
        },
        {
            "course_name": "Excel",
            "name": "Crear una tabla dinámica",
        },
        {
            "course_name": "Excel",
            "name": "Proteger una hoja",
        },
        {
            "course_name": "Excel",
            "name": "Acelera tu flujo de trabajo",
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
