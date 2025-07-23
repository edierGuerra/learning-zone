# /core/initial_evaluations.py

import json  # Necesario para json.dumps
import logging
from typing import Dict, Any, List

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from models.lesson_model import (
    Lesson,
)  # Necesario para obtener los IDs de las lecciones
from models.evaluation_model import (
    Evaluation,
    QuestionType,
)  # El modelo de la evaluacion con la clase que describe el Enum

logger = logging.getLogger(__name__)


async def create_initial_evaluations(db: AsyncSession):
    """
    Crea las evaluaciones iniciales en la base de datos y las asocia a las lecciones existentes. Cada lección tiene una evaluación.
    """
    # Obtener los IDs de las lecciones existentes mapeadas por su nombre y curso
    # Necesitamos obtener tanto el ID de la lección como el nombre para mapear correctamente. (asocia las evaluaciones a las lecciones).
    lesson_data_map: Dict[str, Dict[str, int]] = (
        {}
    )  # {"CourseName": {"LessonName": x, "lesson_id": y}}

    # Necesitamos obtener el nombre del curso asociado a cada lección.
    # result = await db.execute(select(Lesson).id, Lesson.name, Lesson.course)) # seleciona el id, el nombre de la leccion y la relacion "course" para el nombre del curso
    result = await db.execute(
        select(Lesson).options(  # Selecciona el objeto Lesson completo
            selectinload(Lesson.course)
        )  # Carga la relación 'course'
    )

    # for lesson_id, lesson_name, course_obj in result.all():
    #     if course_obj: # Asegurarse que el curso exista
    #         course_name = course_obj.name
    #         if course_name not in lesson_data_map:
    #             lesson_data_map[course_name] = {}
    #         lesson_data_map[course_name][lesson_name] = lesson_id

    # Ahora iteras sobre los objetos Lesson directamente
    for (
        lesson_obj
    ) in result.scalars().all():  # Usa .scalars().all() para obtener los objetos Lesson
        # lesson_obj es una instancia de Lesson, y lesson_obj.course es el objeto Course relacionado
        if lesson_obj.course:  # Asegurarse de que el curso exista
            course_name = (
                lesson_obj.course.name
            )  # <--- Accede al nombre del curso a través del objeto Course

            if course_name not in lesson_data_map:
                lesson_data_map[course_name] = {}
            lesson_data_map[course_name][
                lesson_obj.name
            ] = lesson_obj.id  # Usa lesson_obj.name y lesson_obj.id

    if not lesson_data_map:
        logger.warning(
            "[WARNING] No se encontraron lecciones en la base de datos. No se pueden crear evaluaciones."
        )
        return

    # Definir las evaluaciones base
    # Los nombres de las lecciones deben coincidir exactamente
    # con los nombres de las lecciones que se crean en ´initial_lessons.py´
    # Cada diccionario representa una evaluación para una lección específica.
    evaluations_base: List[Dict[str, Any]] = [
        # Evaluación para "Introducción y entorno de trabajo en Word" (Word)
        {
            "course_name": "Word",
            "lesson_name": "Introducción y entorno de trabajo en Word",
            "question": "¿Qué parte de la pantalla de Word contiene las herramientas para dar formato y organizar tu texto?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": ["Barra de estado", "Área de trabajo", "Cinta de opciones"],
            "correct_answer": "Cinta de opciones",
        },
        {
            "course_name": "Word",
            "lesson_name": "Crear, guardar y abrir documentos",
            "question": "¿Cuál es la opción que debes seleccionar para guardar un documento por primera vez?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": ["Nuevo", "Guardar como", "Abrir", "Exportar"],
            "correct_answer": "Guardar como",
        },
        {
            "course_name": "Word",
            "lesson_name": "Formato de texto",
            "question": "¿Cuál de estas opciones sirve para poner un texto en negrita?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": ["Ctrl + I", "Ctrl + U", "Ctrl + B"],
            "correct_answer": "Ctrl + B",
        },
        {
            "course_name": "Word",
            "lesson_name": "Párrafos y listas",
            "question": "¿Qué opción usarías para organizar una lista de tareas en Word?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": ["Viñetas", "Alineación", "Interlineado", "Tabulaciones"],
            "correct_answer": "Viñetas",
        },
        {
            "course_name": "Word",
            "lesson_name": "Insertar y dar formato a tablas",
            "question": "¿Cuál es la función de “Combinar celdas” en una tabla de Word?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Dividir una celda en varias",
                "Cambiar el color de las celdas",
                "Unir dos o más celdas en una sola",
            ],
            "correct_answer": "Unir dos o más celdas en una sola",
        },
        {
            "course_name": "Word",
            "lesson_name": "Insertar imágenes, formas e iconos",
            "question": "Explica en qué pestaña de Microsoft Word se encuentra la opción para insertar una imagen",
            "question_type": QuestionType.OPEN_QUESTION,
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Word",
            "lesson_name": " Encabezados, pies de página y numeración",
            "question": "¿Para qué sirve el pie de página en un documento?",
            "question_type": QuestionType.OPEN_QUESTION,
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Word",
            "lesson_name": " Bordes y sombreados",
            "question": "¿Qué función tiene el sombreado en Word?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Cambiar el color de fondo de un texto o párrafo",
                "Cambiar el tipo de letra",
                "Crear una lista",
                "Insertar un borde automático",
            ],
            "correct_answer": "Cambiar el color de fondo de un texto o párrafo",
        },
        {
            "course_name": "Word",
            "lesson_name": "Diseño de página: márgenes, tamaño y orientación",
            "question": "¿Qué opción cambiarías para imprimir un documento en horizontal?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": ["Márgenes", "Tamaño", "Orientación"],
            "correct_answer": "Orientación",
        },
        {
            "course_name": "Word",
            "lesson_name": "Estilos y temas rápidos",
            "question": "¿Qué es un estilo en Word?",
            "question_type": QuestionType.OPEN_QUESTION,
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Word",
            "lesson_name": "Aplicar columnas de texto",
            "question": "¿Para qué se utiliza la herramienta “Columnas” en Microsoft Word y en qué tipo de documentos resulta especialmente útil?",
            "question_type": QuestionType.OPEN_QUESTION,
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Word",
            "lesson_name": "Insertar enlaces, notas al pie y marcadores",
            "question": "¿Qué es un hipervínculo en Word?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Un enlace que te lleva a una página web o lugar dentro del documento",
                "Una imagen insertada",
                "Un tipo de letra",
                "Un marcador que cambia automáticamente el diseño de la página",
            ],
            "correct_answer": "Un enlace que te lleva a una página web o lugar dentro del documento",
        },
        {
            "course_name": "Word",
            "lesson_name": " Uso del panel de navegación y búsqueda",
            "question": "¿Para qué sirve el panel de navegación en Word?",
            "question_type": QuestionType.OPEN_QUESTION,
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Word",
            "lesson_name": "Combinación de correspondencia (mail merge)",
            "question": "¿Para qué sirve la combinación de correspondencia?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Para insertar imágenes",
                "Para personalizar documentos en masa con datos diferentes",
                "Para crear listas",
            ],
            "correct_answer": "Para personalizar documentos en masa con datos diferentes",
        },
        {
            "course_name": "Word",
            "lesson_name": "Crear índice o tabla de contenido",
            "question": "¿Qué función tiene la tabla de contenido en un documento?",
            "question_type": QuestionType.OPEN_QUESTION,
            "options": [
                "Cambiar el color del texto",
                "Mostrar los títulos y su ubicación en el documento",
                "Insertar imágenes",
                "Generar automáticamente notas al pie en cada página",
            ],
            "correct_answer": "Mostrar los títulos y su ubicación en el documento",
        },
        {
            "course_name": "Word",
            "lesson_name": "Revisar ortografía y sinónimos",
            "question": "¿Qué función tiene el corrector ortográfico en Word?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Cambiar el color del texto",
                "Insertar imágenes",
                "Detectar y corregir errores de ortografía y gramática",
            ],
            "correct_answer": "Detectar y corregir errores de ortografía y gramática",
        },
        {
            "course_name": "Word",
            "lesson_name": "Control de cambios y comentarios",
            "question": "¿Para qué sirve el control de cambios?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Para escribir texto nuevo",
                "Para cambiar la fuente",
                "Para ver y gestionar las modificaciones hechas en un documento",
                "Para bloquear la edición de un párrafo automáticamente",
            ],
            "correct_answer": "Para ver y gestionar las modificaciones hechas en un documento",
        },
        {
            "course_name": "Word",
            "lesson_name": "Protección y restricción del documento",
            "question": "¿Qué pasa cuando activas la restricción de edición en un documento?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Cualquiera puede editar el documento libremente",
                "Solo las personas autorizadas pueden hacer cambios",
                "El documento se borra",
            ],
            "correct_answer": "Solo las personas autorizadas pueden hacer cambios",
        },
        {
            "course_name": "Word",
            "lesson_name": "Imprimir y guardar o exportar como PDF",
            "question": "¿Por qué es útil guardar un documento en PDF?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Para editarlo fácilmente",
                "Para cambiar el tipo de letra",
                "Para reducir automáticamente la cantidad de páginas del documento",
                "Para que el formato se mantenga igual en cualquier dispositivo",
            ],
            "correct_answer": "Para que el formato se mantenga igual en cualquier dispositivo",
        },
        {
            "course_name": "Word",
            "lesson_name": "Atajos de teclado básicos en Word",
            "question": "¿Qué hace el atajo Ctrl+Z en Word?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Copiar",
                "Pegar",
                "Deshacer la última acción",
                "Rehacer automáticamente los cambios eliminados",
            ],
            "correct_answer": "Deshacer la última acción",
        },
        {
            "course_name": "Word",
            "lesson_name": "Uso de plantillas en Word",
            "question": QuestionType.OPEN_QUESTION,
            "question_type": "¿Qué es una plantilla en Word?",
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Word",
            "lesson_name": "Insertar gráficos y SmartArt",
            "question": "¿Para qué sirve insertar un gráfico en Word?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Para añadir texto",
                "Para representar datos visualmente",
                "Para cambiar el color del texto",
                "Para convertir automáticamente una tabla en un índice",
            ],
            "correct_answer": "Para representar datos visualmente",
        },
        # --- Evaluaciones para Excel ---
        {
            "course_name": "Excel",
            "lesson_name": "Introducción y entorno de trabajo en Excel",
            "question": "¿Cuál es el objetivo principal de Excel según el texto?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Crear presentaciones animadas",
                "Guardar información, analizar datos, realizar cálculos y visualizarlos con gráficos",
                "Editar imágenes y videos",
                "Diseñar sitios web de forma automática",
            ],
            "correct_answer": "Guardar información, analizar datos, realizar cálculos y visualizarlos con gráficos",
        },
        {
            "course_name": "Excel",
            "lesson_name": "Modificar datos",
            "question": "¿Qué tecla presionas para entrar en 'modo edición' en una celda que ya tiene un dato?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "CTRL",
                "F2",
                "ALT",
            ],
            "correct_answer": "ALT",
        },
        {
            "course_name": "Excel",
            "lesson_name": "Seleccionar y autorellenar",
            "question": "Si escribes 'Enero' en una celda y arrastras el controlador de relleno hacia abajo, ¿Qué crees que escribirá Excel en las siguientes celdas?",
            "question_type": QuestionType.OPEN_QUESTION,
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Excel",
            "lesson_name": "Copiar y Pegar (basico)",
            "question": "Después de copiar con CTRL+C, ¿qué tecla debes presionar para que las 'hormigas marchantes' desaparezcan sin pegar nada?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "ESC",
                "Enter",
                "Tab",
                "Shift",
            ],
            "correct_answer": "ESC",
        },
        {
            "course_name": "Excel",
            "lesson_name": "Copiar y pegar (especial)",
            "question": "Quieres copiar el estilo de una celda (fondo amarillo y letra en negrita) a otra celda, pero sin copiar el número que contiene. ¿Qué opción del Pegado Especial usarías?",
            "question_type": QuestionType.OPEN_QUESTION,
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Excel",
            "lesson_name": "Insertar, mover hojas y eliminar hojas",
            "question": "¿Se puede deshacer la acción de eliminar una hoja con CTRL+Z?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Sí, siempre",
                "Solo si no has guardado",
                "No, es una acción permanente",
            ],
            "correct_answer": "No, es una acción permanente",
        },
        {
            "course_name": "Excel",
            "lesson_name": "Formato condicional",
            "question": "¿En qué pestaña de la cinta de opciones se encuentra la herramienta de Formato Condicional?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Datos",
                "Inicio",
                "Insertar",
                "Formulas",
            ],
            "correct_answer": "Inicio",
        },
        {
            "course_name": "Excel",
            "lesson_name": "Formatos numéricos clave",
            "question": "Estás preparando un informe financiero y quieres que todos los símbolos de euro (€) de una columna estén perfectamente alineados a la izquierda. ¿Qué formato numérico deberías usar?",
            "question_type": QuestionType.OPEN_QUESTION,
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Excel",
            "lesson_name": "Jerarquía de operadores",
            "question": "¿Qué resultado dará la fórmula '=5+3*2' en Excel?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "16",
                "12",
                "11",
                "10",
            ],
            "correct_answer": "11",
        },
        {
            "course_name": "Excel",
            "lesson_name": "Referencias absolutas ($)",
            "question": "Si tienes una fórmula =B2*C10 y quieres que al arrastrarla hacia abajo la referencia a la celda C10 no cambie, ¿cómo debería quedar esa parte de la fórmula?",
            "question_type": QuestionType.OPEN_QUESTION,
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Excel",
            "lesson_name": "Función SUMA",
            "question": "¿Cuál es el atajo de teclado para usar la Autosuma?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "CTRL + S",
                "ALT + =",
                "CTRL + A",
            ],
            "correct_answer": "ALT + =",
        },
        {
            "course_name": "Excel",
            "lesson_name": "PROMEDIO, CONTAR, MAX, MIN ",
            "question": "Si tienes una lista de productos y quieres saber cuántos productos diferentes tienes en total, ¿qué función usarías?",
            "question_type": QuestionType.OPEN_QUESTION,
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Excel",
            "lesson_name": "Ordenar datos",
            "question": "¿Qué significa 'Agregar nivel' en el cuadro de diálogo de Ordenar?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Añadir más filas a la tabla",
                "Combinar automáticamente celdas con datos similares",
                "Crear un segundo criterio de ordenación",
                "Aumentar el tamaño de la fuente",
            ],
            "correct_answer": "Crear un segundo criterio de ordenación",
        },
        {
            "course_name": "Excel",
            "lesson_name": "Filtrar datos",
            "question": "Después de aplicar un filtro en la columna 'País' para ver solo 'España', ¿cómo puedes saber visualmente que esa columna tiene un filtro activo?",
            "question_type": QuestionType.OPEN_QUESTION,
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Excel",
            "lesson_name": "Crear un gráfico",
            "question": "Quieres mostrar la evolución de las ventas de tu empresa mes a mes durante el último año. ¿Qué tipo de gráfico sería el más adecuado?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Gráfico circular",
                "Gráfico de líneas",
                "Gráfico de barras",
            ],
            "correct_answer": "Gráfico de líneas",
        },
        {
            "course_name": "Excel",
            "lesson_name": "Función SI (IF)",
            "question": "En la fórmula `=SI(A1>50; 'Sí'; 'No')`, ¿qué resultado aparecerá si la celda A1 contiene el número 45?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Sí",
                "No",
                "Error",
                "Verdadero",
            ],
            "correct_answer": "No",
        },
        {
            "course_name": "Excel",
            "lesson_name": "Función BUSCARV (VLOOKUP)",
            "question": "En la función BUSCARV, ¿por qué es tan importante usar referencias absolutas (con $) en el argumento matriz_tabla al copiar la fórmula hacia abajo?",
            "question_type": QuestionType.OPEN_QUESTION,
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Excel",
            "lesson_name": "Crear listas desplegables",
            "question": "¿Cuál es el principal beneficio de usar una lista desplegable en una celda?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Hace que la celda se vea más colorida",
                "Realiza cálculos automáticos",
                "Evita errores de escritura y estandariza los datos",
            ],
            "correct_answer": "Evita errores de escritura y estandariza los datos",
        },
        {
            "course_name": "Excel",
            "lesson_name": "Convertir un rango en tabla",
            "question": "Menciona dos ventajas automáticas que obtienes al convertir un rango de datos en una Tabla de Excel",
            "question_type": QuestionType.OPEN_QUESTION,
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Excel",
            "lesson_name": "Crear una tabla dinámica",
            "question": "En una Tabla Dinámica, ¿en qué área arrastrarías un campo de 'Ventas' para poder sumar todos los importes?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Valores",
                "Filas",
                "Filtros",
                "Columnas",
            ],
            "correct_answer": "Valores",
        },
        {
            "course_name": "Excel",
            "lesson_name": "Proteger una hoja",
            "question": "¿Cuál es el primer paso que debes hacer antes de proteger una hoja si quieres que los usuarios puedan editar algunas celdas específicas?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": None,
            "correct_answer": None,
        },
        {
            "course_name": "Excel",
            "lesson_name": "Acelera tu flujo de trabajo",
            "question": "¿Qué atajo de teclado te permite seleccionar rápidamente toda una columna de datos contiguos desde la celda activa hasta la última celda con información?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "CTRL + Flecha abajo",
                "SHIFT + Flecha abajo",
                "CTRL + SHIFT + Flecha abajo",
                "ALT + Flecha abajo",
            ],
            "correct_answer": "CTRL + SHIFT + Flecha abajo",
        },
        # --- Evaluaciones para PowerPoint ---
        {
            "course_name": "PowerPoint",
            "lesson_name": "Primeros Pasos en PowerPoint",
            "question": "¿Cuál es el objetivo principal de Excel según el texto?",
            "question_type": QuestionType.MULTIPLE_CHOICE,
            "options": [
                "Crear presentaciones animadas",
                "Guardar información, analizar datos, realizar cálculos y visualizarlos con gráficos",
                "Editar imágenes y videos",
                "Diseñar sitios web de forma automática",
            ],
            "correct_answer": "Guardar información, analizar datos, realizar cálculos y visualizarlos con gráficos",
        },
    ]

    # Iterar y crear las evaluaciones
    for data in evaluations_base:
        course_name = data["course_name"]
        lesson_name = data["lesson_name"]

        lesson_id = lesson_data_map.get(course_name, {}).get(lesson_name)

        if lesson_id is None:
            logger.warning(
                f"[WARNING] Lección '{lesson_name}' del curso '{course_name}' no encontrado. Saltando creación de evaluación."
            )
            continue

        result = await db.execute(
            select(Evaluation).where(Evaluation.id_leccion == lesson_id)
        )
        existing_evaluation = result.scalars().first()

        if existing_evaluation:
            logger.info(
                f"[INFO] La evaluación para la lección '{lesson_name}' (ID: {lesson_id}) ya existe. No se crea de nuevo."
            )
            continue

        options_to_store = (
            json.dumps(data["options"]) if data["options"] is not None else None
        )
        correct_answer_to_store = data["correct_answer"]

        evaluation = Evaluation(
            question=data["question"],
            question_type=data[
                "question_type"
            ],  # <--- Pasa el miembro del Enum directamente
            options=options_to_store,
            correct_answer=correct_answer_to_store,
            id_leccion=lesson_id,
        )
        db.add(evaluation)
        logger.info(
            f"[INFO] Evaluación creada para la lección '{lesson_name}' (ID: {lesson_id}). Tipo: {data['question_type'].value}"  # Accede al valor del Enum para el log"
        )

        await db.commit()
        logger.info("[INFO] Evaluaciones base inicializadas correctamente.")
