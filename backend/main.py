# main.py

"""
Este módulo contiene toda la configuración inicial de FastAPI,
estructurada de manera eficiente para garantizar
una integración fluida y un arranque óptimo del sistema,
facilitando el desarrollo y la personalización de la aplicación.
"""

import logging
import os
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager

from schemas.suggestion_schemas import SuggestionCreate
from services.utils.email_sender import send_suggestion_email
from core.security import get_current_role
from database.config_db import Base, engine, async_session, verify_database_connection  # Base de datos
import google.generativeai as genai
from dotenv import load_dotenv
from config import settings
import services.evaluation_service as eval_svc


# Modulos internos
from core.initial_lessons import create_initial_lessons

# Importa la nueva función de inicialización de evaluaciones
from core.initial_evaluations import create_initial_evaluations

from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware  # Importa CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


from routes.identification_routes import router as identification_router
from routes.student_routes import router as student_router
from routes.recovery_password_routes import router as recovery_password_router
from routes.notifications_routes import router as notification_router
from routes.lesson_routes import router as lesson_router
from routes.course_routes import router as course_router
from routes.comment_routes import router as comment_router
from routes.content_routes import router as content_router
from routes.evaluation_routes import router as evaluation_router
from teacher.routes import router as teacher_router

from core.initial_data import create_initial_courses
from core.initial_content import create_initial_contents

from super_admin import create_admin

logger = logging.getLogger(__name__)


bearer_scheme = HTTPBearer()

load_dotenv()
GEMINI_API_KEY = settings.gemini_api_key

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel("models/gemini-1.5-flash")
    logger.info("Modelo Gemini configurando y cargado.")
else:
    gemini_model = None
    logger.warning(
        "GEMINI_API_KEY no configurada. La evaluación de preguntas abiertas no funcionará."
    )

eval_svc.global_gemini_model = gemini_model


# --- Lifespan moderno (reemplaza on_event) ---
# Mapear la base de datos al iniciar la app
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Ejecutado al iniciar la app. Crea las tablas y cursos base.
    """
    try:
        # Verificar conexión a la base de datos
        logger.info("🔍 Verificando conexión a la base de datos...")
        db_status = await verify_database_connection()
        if db_status.get("status") != "connected":
            logger.error(f"❌ Error conectando a la base de datos: {db_status}")
            # En producción, continuar sin fallar completamente
            if os.getenv("ENVIRONMENT", "development") == "production":
                logger.warning("⚠️ Continuando en modo producción sin verificación de DB")
            else:
                raise Exception(f"Database connection failed: {db_status}")
        else:
            logger.info("✅ Conexión a base de datos verificada")
        
        # Crear tablas
        async with engine.begin() as conn:
            # Solo hacer drop_all en desarrollo, no en producción
            environment = os.getenv("ENVIRONMENT", "development")
            if environment == "development":
                await conn.run_sync(Base.metadata.drop_all)
                logger.info("🗑️  Tablas eliminadas (modo desarrollo)")
            
            await conn.run_sync(Base.metadata.create_all)
            logger.info("✅ Tablas creadas")

        # Solo inicializar datos en desarrollo para evitar timeouts en producción
        environment = os.getenv("ENVIRONMENT", "development")
        
        # Siempre crear el administrador (tanto en desarrollo como producción)
        async with async_session() as session:
            await create_admin()
            logger.info("✅ Administrador verificado/creado")
        
        if environment == "development":
            # Crear cursos, lecciones y contenidos
            async with async_session() as session:
                await create_initial_courses(session)
                logger.info("✅ Cursos base creados")
                await create_initial_lessons(session)
                logger.info("✅ Lecciones base creadas")
                await create_initial_contents(session)
                logger.info("✅ Contenidos base tipo imagen creados")
                await create_initial_evaluations(session)
                logger.info("✅ Evaluaciones base creadas")
        else:
            logger.info("⚡ Modo producción: datos iniciales omitidos para startup rápido")

        logger.info("✅ Backend inicializado correctamente")
        yield
        logger.info("🛑 Servidor detenido")
        
    except Exception as e:
        logger.error(f"❌ Error durante inicialización: {str(e)}")
        # En producción, no fallar por problemas de inicialización de datos
        if os.getenv("ENVIRONMENT", "development") == "production":
            logger.warning("⚠️ Continuando en modo producción sin datos iniciales")
            yield
        else:
            raise


# Crear la app
app = FastAPI(
    title="Learning Zone API",
    description="Learning Zone API es una API REST potente y completa que proporciona todas las funcionalidades esenciales para el óptimo funcionamiento del proyecto. Permite gestionar operaciones de manera eficiente, garantizando una integración fluida y un rendimiento confiable en cada etapa del proceso.",
    version="1.0",
    lifespan=lifespan,  # ✅ Aquí enlazamos la función
    root_path="/backend",  # 🔥 Configurar root path para /backend (necesario para DigitalOcean)
    openapi_url="/backend/openapi.json",  # 🔥 URL explícita para OpenAPI
    docs_url="/backend/docs",  # 🔥 URL explícita para documentación
    redoc_url="/backend/redoc",  # 🔥 URL explícita para ReDoc
    contact={
        "Authors": [
            "Edier Andrés Guerra Vargas",
            "Camilo Andres Ospina Villa",
            "Junior Herrera Agudelo",
            "Charif Tatiana Giraldo",
        ]
    },
)

# --- CONFIGURACIÓN CORS ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    # Producción DigitalOcean
    "https://learning-zone-app.ondigitalocean.app",
    "https://*.ondigitalocean.app",  # Permite todos los subdominios de DigitalOcean
    "https://localhost:3000",
]

# Agregar también variables de entorno para CORS
if "FRONTEND_URL" in os.environ:
    origins.append(os.environ["FRONTEND_URL"])
if "CHAT_SERVICE_URL" in os.environ:
    origins.append(os.environ["CHAT_SERVICE_URL"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Lista de orígenes permitidos
    allow_credentials=True,  # Permitir cookies y credenciales
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)
# --- FIN CONFIGURACIÓN CORS ---

# Carga de archivos estaticos y plantillas
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


# Ruta principal del backend
@app.get("/", response_class=HTMLResponse, tags=["Root"])
async def root(request: Request):
    """
    Esta ruta devuelve una página HTML de bienvenida a la documentación del backend,
    diseñada de forma clara y accesible para guiar a los usuarios en la exploración
    de las funcionalidades y recursos del sistema.
    """
    # Retorna el archivo index.html, pasando el objeto request obligatorio
    return templates.TemplateResponse("index.html", {"request": request})


# Ruta de redirección para /api
@app.get("/api", tags=["Root"])
async def api_root():
    """Redirección a la documentación de la API"""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/api/docs")


# Health check endpoint para DigitalOcean
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint para monitoreo de DigitalOcean"""
    try:
        # Verificar que la aplicación esté funcionando
        import datetime
        return {
            "status": "healthy", 
            "service": "learning-zone-backend",
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "version": "1.0"
        }
    except Exception as e:
        return {
            "status": "unhealthy", 
            "service": "learning-zone-backend",
            "error": str(e)
        }


# Endpoint manual para OpenAPI (fallback)
@app.get("/openapi.json", tags=["OpenAPI"])
async def get_openapi():
    """Endpoint manual para OpenAPI schema"""
    from fastapi.openapi.utils import get_openapi
    return get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )


# Endpoint para verificar conectividad entre servicios
@app.get("/api/status", tags=["Status"])
async def service_status():
    """Endpoint para verificar el estado del backend y sus dependencias"""
    db_status = await verify_database_connection()
    return {
        "backend": "OK",
        "database": db_status,
        "cors_origins": origins,
        "gemini": "Configured" if gemini_model else "Not configured"
    }


# Endpoint específico para verificar solo la base de datos
@app.get("/api/database/status", tags=["Database"])
async def database_status():
    """Endpoint para verificar específicamente el estado de la base de datos"""
    return await verify_database_connection()


# Endpoint para inicializar datos después del deploy
@app.post("/api/database/initialize", tags=["Database"])
async def initialize_database():
    """Endpoint para inicializar datos base después del deploy (solo usar una vez)"""
    try:
        async with async_session() as session:
            await create_admin()
            await create_initial_courses(session)
            await create_initial_lessons(session)
            await create_initial_contents(session)
            await create_initial_evaluations(session)
        
        return {
            "status": "success",
            "message": "Datos base inicializados correctamente",
            "initialized": ["admin", "courses", "lessons", "contents", "evaluations"]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error inicializando datos: {str(e)}"
        }


@app.get("/api/v1/role", dependencies=[Depends(bearer_scheme)])
async def valid_user_role(role: str = Depends(get_current_role)):
    """Valida el rol de un usuario en base a un token JWT."""
    return {"role": role}


# -- Sugerencias
@app.post("/suggestions/send", tags=["Suggestions"])
async def send_suggestion(suggestion: SuggestionCreate):
    """
    Envía una sugerencia por correo usando la plantilla de SendGrid.
    """
    send_suggestion_email(
        sender=suggestion.sender,
        email_sender=suggestion.email_sender,
        content_message=suggestion.content_message,
        to_email=suggestion.to_email,
        subject=suggestion.subject,
    )
    return {"message": "Sugerencia enviada correctamente"}


# --- Routers ----
app.include_router(identification_router)
app.include_router(student_router)
app.include_router(recovery_password_router)
app.include_router(notification_router)
app.include_router(lesson_router)
app.include_router(course_router)
app.include_router(comment_router)
app.include_router(content_router)
app.include_router(evaluation_router)
app.include_router(teacher_router)
