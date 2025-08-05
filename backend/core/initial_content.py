# core/initial_content.py

from models.content_model import Content, TypeContent
from models.lesson_model import Lesson
from sqlalchemy.ext.asyncio import (
    AsyncSession,
)  # Sesión asincrónica para interactuar con la base de datos. Estandarizado para apps con FastAPI.
from sqlalchemy import select  # Crear consultas SQL de forma segura y eficiente.
import logging  # Para registrar advertencias e información en la consola o en archivos de log.

logger = logging.getLogger(__name__)


# Funcion asincrónica que recibe una sesión de base de daots y ejecuta la carga de contenidos iniciales.
async def create_initial_contents(db: AsyncSession):
    """
    Crea contenidos iniciales tipo imagen asociados a las lecciones,
    usando IDs reales a partir del nombre de la lección.
    """
    # Obtener todas las lecciones existentes obteniendo su ID y nombre.
    result = await db.execute(select(Lesson.id, Lesson.name))
    lesson_rows = result.all()

    if not lesson_rows:
        logger.warning("[WARNING] No se encontraron lecciones en la base de datos.")
        return

    # Mapeo: nombre de la lección → id, se define un diccionario de nombre:lesson_id por el for que extrae los datos del objeto lesson_rows.
    lesson_name_to_id = {name: id_ for id_, name in lesson_rows}

    # Contenidos base con tipo de contenido 'image' y descripción obligatoria 'text'
    contents_base = [
        # --- Contenido para Word ---
        {
            "lesson_name": "Introducción y entorno de trabajo en Word",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-1.png",
            "text": """Microsoft Word es un programa para crear y editar documentos de texto. Cuando abres Word, lo primero que ves es su entorno de trabajo, donde están las herramientas para escribir, dar formato y organizar tu documento. Conocer cada parte te ayudará a usar Word con confianza y rapidez.
        Cinta de opciones: Dar formato y organizar textos
        Barra de herramientas de acceso rápido: Contiene comandos frecuentes para guardar y deshacer
        Área de trabajo: Pate central donde aparece la hoja en blanco y donde escribes, editas y visualizas tu documento
        Barra de estado : Muestra información útil como el número de página actual, el total de páginas, el conteo de palabras, el idioma y opciones para cambiar la vista o el zoom.""",
        },
        {
            "lesson_name": "Crear, guardar y abrir documentos",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-2.png",
            "text": "Para trabajar en Word, puedes usar la opción Nuevo para crear un documento desde cero, Guardar como para guardar tu archivo por primera vez o con un nombre diferente, y Abrir para acceder a documentos que ya tienes guardados.",
        },
        {
            "lesson_name": "Formato de texto",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-3.png",
            "text": """Dar formato al texto mejora la apariencia de tu documento. Puedes cambiar fuente, tamaño y color, aplicar negrita, cursiva o subrayado, y ajustar la alineación para que el texto quede organizado y fácil de leer.
            Para aplicar negrita, cursiva o subrayado:

            1. Selecciona el texto que quieres modificar.
            2. En la pestaña **Inicio**, haz clic en el botón **B** para negrita, **I** para cursiva o **U** para subrayado.
            3. También puedes usar los atajos de teclado:
                - **Ctrl + B** para negrita
                - **Ctrl + I** para cursiva
                - **Ctrl + U** para subrayado""",
        },
        {
            "lesson_name": "Párrafos y listas",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-4.png",
            "text": "Los párrafos se organizan con espacios y alineaciones que hacen que tu texto sea más fácil de leer. Puedes ajustar el interlineado y el espacio entre párrafos para dar un mejor formato. Además, las listas con viñetas o numeradas te ayudan a organizar tareas o pasos de manera clara y ordenada.",
        },
        {
            "lesson_name": "Insertar y dar formato a tablas",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-5.jpg",
            "text": "Las tablas son útiles para organizar información en filas y columnas. Puedes insertar una tabla, agregar o eliminar filas y columnas, y dar formato cambiando bordes, colores y estilos para que se vea profesional y clara.",
        },
        {
            "lesson_name": "Insertar imágenes, formas e iconos",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-6.png",
            "text": "Puedes hacer que tu documento sea más visual e interesante insertando imágenes, formas y iconos. Word permite agregar imágenes desde tu computadora o en línea, y también incluir formas como flechas, círculos y cuadros para resaltar información.",
        },
        {
            "lesson_name": "Encabezados, pies de página y numeración",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-7.png",
            "text": "Los encabezados y pies de página aparecen en todas las páginas del documento y son ideales para incluir títulos, fechas o números de página. Numerar las páginas te ayuda a organizar documentos largos.",
        },
        {
            "lesson_name": "Bordes y sombreados",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-8.png",
            "text": "Los bordes y sombreados se usan para resaltar texto o párrafos, haciendo que ciertas áreas destaquen. Puedes agregar bordes simples, dobles o sombreados de color para dar estilo a tu documento.",
        },
        {
            "lesson_name": "Diseño de página: márgenes, tamaño y orientación",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-9.png",
            "text": "El diseño de página permite ajustar los márgenes, el tamaño del papel y la orientación (vertical u horizontal). Esto es importante para adaptar el documento según su propósito o formato de impresión.",
        },
        {
            "lesson_name": "Estilos y temas rápidos",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-10.png",
            "text": "Los estilos y temas te permiten aplicar formatos predefinidos a títulos, subtítulos y párrafos para que tu documento tenga un diseño uniforme y profesional con solo un clic.",
        },
        {
            "lesson_name": "Aplicar columnas de texto",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-11.png",
            "text": "Puedes dividir tu documento en columnas para darle un estilo tipo periódico o revista. Esto es útil para boletines o documentos que necesiten un diseño más organizado.",
        },
        {
            "lesson_name": "Insertar enlaces, notas al pie y marcadores",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-12.png",
            "text": "Los enlaces permiten conectar a otras páginas web o partes del documento. Las notas al pie dan información adicional al final de la página y los marcadores ayudan a navegar dentro del documento fácilmente.",
        },
        {
            "lesson_name": "Uso del panel de navegación y búsqueda",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-13.png",
            "text": "El panel de navegación facilita moverte por el documento, buscar palabras o frases y reorganizar secciones arrastrando títulos. Esto es especialmente útil en documentos largos.",
        },
        {
            "lesson_name": "Combinación de correspondencia (mail merge)",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-14.png",
            "text": "La combinación de correspondencia permite crear cartas, etiquetas o sobres personalizados usando datos de una lista o base de datos. Ideal para enviar documentos a muchas personas con datos únicos.",
        },
        {
            "lesson_name": "Crear índice o tabla de contenido",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-15.png",
            "text": "El índice o tabla de contenido muestra los títulos y subtítulos del documento con sus números de página, facilitando la navegación y organización del texto.",
        },
        {
            "lesson_name": "Revisar ortografía y sinónimos",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-16.png",
            "text": "Word te ayuda a corregir errores ortográficos y gramaticales con su corrector automático. Además, puedes usar el diccionario de sinónimos para mejorar la variedad de tu texto.",
        },
        {
            "lesson_name": "Control de cambios y comentarios",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-17.png",
            "text": "El control de cambios permite ver las modificaciones hechas en un documento, ideal para revisar y aceptar o rechazar cambios. Los comentarios sirven para añadir notas o sugerencias sin alterar el texto.",
        },
        {
            "lesson_name": "Protección y restricción del documento",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-18.png",
            "text": "Puedes proteger tu documento para que solo ciertas personas puedan editarlo o para evitar cambios accidentales. Esto es útil en documentos importantes o compartidos.",
        },
        {
            "lesson_name": "Imprimir y guardar o exportar como PDF ",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-19.png",
            "text": "Antes de imprimir o compartir, puedes guardar tu documento en formatos como PDF para asegurar que se vea igual en cualquier dispositivo. Word ofrece opciones para imprimir con diferentes configuraciones.",
        },
        {
            "lesson_name": "Atajos de teclado básicos en Word",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-20.png",
            "text": "Usar atajos de teclado te hace más rápido y eficiente. Algunos básicos son Ctrl+C para copiar, Ctrl+V para pegar y Ctrl+Z para deshacer.",
        },
        {
            "lesson_name": "Uso de plantillas en Word",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-21.png",
            "text": "Las plantillas son documentos preformateados que puedes usar para crear rápidamente cartas, currículos, informes y más. Solo tienes que elegir una plantilla y personalizarla.",
        },
        {
            "lesson_name": "Insertar gráficos y SmartArt",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/word/content-word-22.png",
            "text": "Word permite insertar gráficos y SmartArt para representar información visualmente. Puedes elegir diferentes tipos como barras, circulares o diagramas para organizar ideas.",
        },
        # --- Contenido para Excel---
        {
            "lesson_name": "Introducción y entorno de trabajo en Excel",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-1.png",
            "text": "",
        },
        {
            "lesson_name": "Modificar datos",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-2.png",
            "text": "Aprender a meter y corregir información es el primer paso. Parece simple, pero hacerlo bien te ahorrará un montón de tiempo y dolores de cabeza.",
        },
        {
            "lesson_name": "Seleccionar y autorrellenar",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-3.png",
            "text": "Seleccionar datos de forma eficiente y dejar que Excel trabaje por ti con el autorrelleno son dos trucos que te convertirán en un usuario mucho más rápido.",
        },
        {
            "lesson_name": "Copiar y Pegar (básico)",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-4.png",
            "text": "Es la acción más común en cualquier programa. Aprender a duplicar información rápidamente es fundamental para no tener que escribir lo mismo dos veces.",
        },
        {
            "lesson_name": "Copiar y pegar (especial)",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-5.png",
            "text": "A veces no quieres copiarlo todo. El 'Pegado Especial' es como un menú secreto que te deja elegir qué pegar: solo el resultado, la fórmula, el estilo, etc.",
        },
        {
            "lesson_name": "Insertar, mover hojas y eliminar hojas",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-6.png",
            "text": "Tus archivos de Excel pueden tener varias 'páginas' u hojas. Saber cómo crearlas y quitarlas es clave para mantener tus proyectos bien organizados.",
        },
        {
            "lesson_name": "Formato condicional",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-7.png",
            "text": "Es como darle inteligencia a tus celdas. Hacen que cambien de color solas para resaltar datos importantes, como ventas altas, fechas vencidas o valores repetidos.",
        },
        {
            "lesson_name": "Formatos numéricos clave",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-8.png",
            "text": "Aunque 'Moneda' y 'Contabilidad' se parecen, usar el correcto hará que tus informes se vean mucho más profesionales.",
        },
        {
            "lesson_name": "Jerarquía de operadores",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-9.png",
            "text": "Excel tiene su propio orden para hacer las cuentas. Entenderlo es clave para no cometer errores. La regla de oro: usa paréntesis para decirle a Excel qué hacer primero.",
        },
        {
            "lesson_name": "Referencias absolutas ($)",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-10.png",
            "text": "A veces, cuando arrastras una fórmula, no quieres que una parte de ella cambie (como una tasa de impuesto). Para 'anclar'' una celda, usas las referencias absolutas.",
        },
        {
            "lesson_name": "Función SUMA",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-11.png",
            "text": "Para sumar un montón de números sin tener que usar la calculadora.",
        },
        {
            "lesson_name": "PROMEDIO, CONTAR, MAX, MIN",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-12.png",
            "text": "Son como un chequeo rápido para tus datos. Te dicen el valor promedio, cuántos datos hay, cuál es el más alto y cuál el más bajo",
        },
        {
            "lesson_name": "Ordenar Datos",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-13.png",
            "text": "Para poner tus datos en el orden que quieras (de la A a la Z, del más grande al más pequeño, etc.). Es perfecto para encontrar cosas rápido y agrupar información.",
        },
        {
            "lesson_name": "Filtrar datos",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-14.png",
            "text": "Es como ponerle un colador a tus datos para ver solo lo que te interesa. Oculta temporalmente lo que no necesitas sin borrar nada.",
        },
        {
            "lesson_name": "Crear un gráfico",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-15.png",
            "text": "Para convertir tus aburridos números en una historia visual que todos puedan entender de un vistazo.",
        },
        {
            "lesson_name": "Función SI (IF)",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-16.png",
            "text": " Es como enseñarle a Excel a tomar decisiones. Le dices: 'Si pasa esto, haz aquello; si no, haz esto otro'. Es una de las funciones más útiles que existen.",
        },
        {
            "lesson_name": "Función BUSCARV (VLOOKUP)",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-17.png",
            "text": "Es el detective de Excel. Le das un dato (como un código de producto) y él lo busca en una lista para traerte de vuelta la información que le pidas (como el precio).",
        },
        {
            "lesson_name": "Crear listas desplegables",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-18.png",
            "text": "Para evitar que la gente escriba lo que no debe en una celda. Con esto, les obligas a elegir una opción de una lista que tú has creado, evitando errores.",
        },
        {
            "lesson_name": "Convertir un rango en tabla",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-19.png",
            "text": "Es como darle superpoderes a tus datos. No solo se ven más bonitos, sino que automáticamente tienen filtros, se expanden solos y las fórmulas son más fáciles de leer.",
        },
        {
            "lesson_name": "Crear una tabla dinámica",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-20.png",
            "text": "Es la herramienta más potente de Excel para resumir y analizar montones de datos. Te permite ver la información desde diferentes ángulos con solo arrastrar y soltar.",
        },
        {
            "lesson_name": "Proteger una hoja",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-21.png",
            "text": "Para que cuando compartas tu archivo, nadie pueda dañar por accidente tus fórmulas o datos importantes.",
        },
        {
            "lesson_name": "Acelera tu flujo de trabajo",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/excel/content-excel-22.png",
            "text": "Usar el teclado en lugar del ratón te convertirá en un ninja de Excel. Estos atajos son tus primeras armas.",
        },
        # --- Contenido para PowerPoint ---
        {
            "lesson_name": "Introducción y entorno de trabajo en PowerPoint",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Guardar y abrir presentaciones",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Eliminar diapositivas",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Agregar y dar formato al texto",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Organizar elementos en la diapositiva",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Insertar formas y gráficos básicos",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Insertar y configurar tablas",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Agregar y personalizar gráficos",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Insertar imágenes y multimedia",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Colaborar y Compartir presentaciones",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Aplicar temas y estilos prediseñados",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Configurar fondos y colores personalizados",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Uso de encabezados y pies de página",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Insertar y diseñar SmartArt",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Uso de iconos e ilustraciones",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Insertar audio y video",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Aplicar transiciones y video",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Agregar y personalizar animaciones",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Diseño maestro y plantillas personalizadas",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Uso de la vista Patrón de diapositivas",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Secciones y organización avanzada de presentaciones",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
        {
            "lesson_name": "Configurar y realizar presentaciones en vivo",
            "content_type": TypeContent.IMAGE,
            "content": "/assets/courses/powerpoint/",
            "text": "",
        },
    ]

    # Itera sobre los contendios base, extrayendo el nombre de la leccion y el id en base al nombre de la leccion
    for data in contents_base:
        lesson_name = data["lesson_name"]
        lesson_id = lesson_name_to_id.get(lesson_name)

        if (
            lesson_id is None
        ):  # Verifica si el id no se encuentra, si no se encuentra continua con el siguiente contenido
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
        existing = (
            result.scalars().first()
        )  # Scalars extrae la columna principal o lista sin devolver una tupla y first devuelve el primer objeto o None si no hay resultados.

        if existing:
            logger.info(
                f"[INFO] Contenido ya existe para la lección '{lesson_name}'. No se crea de nuevo."
            )
            continue

        # Crear el objeto Content y agregarlo a la sesión
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

    # Guardar los cambios en la base de datos
    await db.commit()
    logger.info("[INFO] Contenidos tipo imagen inicializados correctamente.")
