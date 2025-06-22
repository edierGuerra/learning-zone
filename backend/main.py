#main.py
"""
Este módulo contiene toda la configuración inicial de FastAPI,
estructurada de manera eficiente para garantizar
una integración fluida y un arranque óptimo del sistema,
facilitando el desarrollo y la personalización de la aplicación.
"""

# Modulos externos
from fastapi import  FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# Modulos internos
from database.config_db import Base, engine
from models.student_model import Student
from models.identification_model import Identification
from routes.student_routes import router as student_router

# Crear la app
app = FastAPI(
    title = "Learning Zone API",
    description="Learning Zone API es una API REST potente y completa que proporciona todas las funcionalidades esenciales para el óptimo funcionamiento del proyecto. Permite gestionar operaciones de manera eficiente, garantizando una integración fluida y un rendimiento confiable en cada etapa del proceso.",
    version="1.0",
    contact={
        "Authors": ["Edier Andres Guerra", "Camilo Andres Ospina Villa", "Junior Herrera Agudelo", "Charift Tatiana Giraldo"]
    },
)
# Carga de archivos estaticos y plantillas
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Ruta principal del backend
@app.get("/", response_class=HTMLResponse,tags=["root"])
async def root(request: Request):
    """
    Esta ruta devuelve una página HTML de bienvenida a la documentación del backend,
    diseñada de forma clara y accesible para guiar a los usuarios en la exploración
    de las funcionalidades y recursos del sistema.
    """
    # Retorna el archivo index.html, pasando el objeto request obligatorio
    return templates.TemplateResponse("index.html", {"request": request})

# Mapear la base de datos al iniciar la app
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Rutas de la app
app.include_router(student_router)