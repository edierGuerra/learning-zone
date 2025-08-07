"""
teacher/routes.py

Este modulo contiene todas la rutas con las diferentes operaciones que puede realizar el profesor
"""

from fastapi import APIRouter, Depends, Form, UploadFile, File, status, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional, List
from fastapi.security import HTTPBearer

from routes.notifications_routes import get_notification_services
from schemas.lesson_schemas import LessonPResponse
from schemas.notification_schemas import NotificationCreate, NotificationResponse
from teacher.schemas import (
    EvaluationCreate,
    EvaluationUpdate,
    IdentificationCreate,
    LessonCResponse,
)
from services.notification_services import NotificationService
from teacher.model import Teacher
from .service import TeacherServices
from models.course_model import CourseCategoryEnum
from models.content_model import TypeContent
from .dependencies import get_teacher_services
import json
from .oauth import get_current_teacher
from .utils import generate_profile_prefix

router = APIRouter(prefix="/api/v1/teachers", tags=["Teacher"])

bearer_scheme = HTTPBearer()


# ---- Rutas de autenticación ----
@router.post(
    "/student",
    status_code=status.HTTP_201_CREATED,
    description="Autentica a un estudiante y devuelve su información.",
    dependencies=[Depends(bearer_scheme)],
    tags=["Students"],
)
async def authenticate_student(
    data: IdentificationCreate,
    teacher_services: TeacherServices = Depends(get_teacher_services),
):
    """
    Autentica a un estudiante y devuelve un mensaje de éxito
    """
    new_ident = await teacher_services.add_identification(data.n_identification)
    return {
        "message": "Identificación registrada exitosamente",
        "id": new_ident.id,
        "n_identification": new_ident.n_identification,
    }


# ---- Rutas de Cursos ----
@router.post(
    "/courses",
    description="Crea un nuevo curso.",
    dependencies=[Depends(bearer_scheme)],
)
async def create_course(
    name: str = Form(...),
    description: str = Form(...),
    category: CourseCategoryEnum = Form(...),
    name_palette: str = Form(...),
    palette: str = Form(...),
    image: UploadFile = File(...),
    teacher_services: TeacherServices = Depends(get_teacher_services),
    teacher: Teacher = Depends(get_current_teacher),
):
    """Crea un nuevo curso con los detalles proporcionados."""
    palette_dict = json.loads(palette)
    course_data = {
        "name": name,
        "description": description,
        "category": category,
        "name_palette": name_palette,
        "palette": palette_dict,
        "image": image,
        "teacher_id": teacher.id,
    }
    new_course = await teacher_services.create_course(course=course_data)
    return {"message": "Curso creado con exito.", "course": new_course}


@router.get(
    "/courses/{course_id}",
    description="Obtiene un curso por su ID.",
    dependencies=[Depends(bearer_scheme)],
)
async def get_course(
    course_id: int,
    teacher_services: TeacherServices = Depends(get_teacher_services),
    teacher: Teacher = Depends(get_current_teacher),
):
    """Obtiene un curso por su ID."""
    course = await teacher_services.get_course_by_id(course_id)
    if not course:
        return {"message": "Curso no encontrado."}
    return {"course": course}


@router.put(
    "/courses/{course_id}",
    description="Actualiza un curso existente.",
    dependencies=[Depends(bearer_scheme)],
    tags=["Courses"],
)
async def update_course(
    course_id: int,
    name: str = Form(None),
    description: str = Form(None),
    image: Optional[UploadFile] = File(None),
    teacher_services: TeacherServices = Depends(get_teacher_services),
    teacher: Teacher = Depends(get_current_teacher),
):
    """Actualiza un curso existente con los nuevos detalles proporcionados."""
    course_data = {
        "teacher_id": teacher.id,
    }
    if name == "":
        name = None
    if description == "":
        description = None
    if image == "":
        image = None
    course = await teacher_services.get_course_by_id(course_id)
    if not course:
        return {"message": "Curso no encontrado."}
    if name is not None:
        course_data["name"] = name
    if description is not None:
        course_data["description"] = description
    if image is not None:
        course_data["image"] = image

    updated_course = await teacher_services.update_course(
        course_id=course_id, course_data=course_data, public_id=course.name
    )
    return {"message": "Curso actualizado con exito.", "id_course": updated_course}


@router.delete(
    "/courses/{course_id}",
    description="Elimina un curso por su ID.",
    dependencies=[Depends(bearer_scheme)],
    tags=["Courses"],
)
async def delete_course(
    course_id: int,
    teacher_services: TeacherServices = Depends(get_teacher_services),
):
    """Elimina un curso por su ID."""
    return await teacher_services.delete_course(course_id)


@router.patch(
    "/courses/{course_id}", dependencies=[Depends(bearer_scheme)], tags=["Courses"]
)
async def publish_course(
    course_id: int,
    teacher_services: TeacherServices = Depends(get_teacher_services),
    teacher: Teacher = Depends(get_current_teacher),
):
    """Publica un curso, haciendolo visible para los estudiantes."""
    return await teacher_services.publish_course(course_id=course_id)


@router.get("/courses/", dependencies=[Depends(bearer_scheme)], tags=["Courses"])
async def get_courses(teacher: Teacher = Depends(get_current_teacher)):
    """Obtiene todos los cursos del profesor actual."""
    return teacher.courses


@router.get(
    "/courses/category/{category}",
    dependencies=[Depends(bearer_scheme)],
    tags=["Courses"],
)
async def filter_courses_by_category(
    category: CourseCategoryEnum,
    teacher_services: TeacherServices = Depends(get_teacher_services),
    teacher: Teacher = Depends(get_current_teacher),
):
    """Filtra los cursos por categoría."""
    return await teacher_services.filter_courses_by_category(category)


# ---- Rutas del profesor ----
@router.get("/", dependencies=[Depends(bearer_scheme)])
async def get_teacher_info(teacher: Teacher = Depends(get_current_teacher)):
    """Obtiene la información del profesor actual."""
    return {
        "id": teacher.id,
        "name": teacher.name,
        "email": teacher.email,
        "specialization": teacher.specialization,
        "last_name": teacher.last_name,
        "prefix_profile": generate_profile_prefix(
            name=teacher.name, last_name=teacher.last_name
        ),
    }


# ---- Rutas de lecciones ----
@router.post(
    "/courses/{course_id}/lessons",
    response_model=LessonPResponse,
    dependencies=[Depends(bearer_scheme)],
    tags=["Lessons"],
)
async def create_lesson_for_course(
    course_id: int,
    name: str = Form(...),
    content_type: TypeContent = Form(...),
    text: str = Form(...),
    file: UploadFile = File(None),
    teacher_services: TeacherServices = Depends(get_teacher_services),
):
    """
    Crea una nueva lección para un curso específico.
    """
    # Sube el archivo si no es texto
    new_lesson = await teacher_services.create_lesson(
        lesson={"name": name, "id_course": course_id},
        content={"content_type": content_type, "file": file, "text": text},
    )
    return new_lesson


@router.get(
    "/courses/{course_id}/lessons",
    description="Obtiene todas las lecciones de un curso por su ID.",
    response_model=List[LessonPResponse],
    dependencies=[Depends(bearer_scheme)],
    tags=["Lessons"],
)
async def get_lessons_by_course(
    course_id: int,
    teacher_services: TeacherServices = Depends(get_teacher_services),
):
    """
    Obtiene todas las lecciones de un curso por su ID.
    Solo accesible para el profesor que creó el curso.
    """
    lessons = await teacher_services.get_lessons_by_course(course_id)
    if not lessons:
        raise HTTPException(
            status_code=404, detail="No se encontraron lecciones para este curso."
        )
    return lessons


@router.get(
    "/lessons/{lesson_id}",
    response_model=LessonCResponse,
    dependencies=[Depends(bearer_scheme)],
    tags=["Lessons"],
)
async def get_lesson(
    lesson_id: int,
    teacher_services: TeacherServices = Depends(get_teacher_services),
):
    """Obtiene una lección por su ID y devuelve su contenido (LessonCResponse)"""
    lesson = await teacher_services.get_lesson_by_id(lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lección no encontrada.")
    return lesson


@router.put(
    "/lessons/{lesson_id}",
    response_model=LessonCResponse,
    dependencies=[Depends(bearer_scheme)],
    tags=["Lessons"],
)
async def update_lesson(
    lesson_id: int,
    name: Optional[str] = Form(None),
    content_type: Optional[TypeContent] = Form(None),
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    teacher_services: TeacherServices = Depends(get_teacher_services),
):
    """
    Actualiza una lección existente. Permite modificar solo el nombre, el contenido o ambos.
    Si se proporciona un archivo, se subirá y actualizará el contenido.
    """
    lesson_data = {}
    content_data = {}

    if name is not None:
        lesson_data["name"] = name
    if content_type is not None:
        content_data["content_type"] = content_type
    if text is not None:
        content_data["text"] = text
    if file is not None:
        content_data["file"] = file

    if not lesson_data and not content_data:
        raise HTTPException(
            status_code=400,
            detail="Debes proporcionar al menos un campo para actualizar.",
        )
    update_lesson = await teacher_services.update_lesson(
        lesson_id, lesson_data, content_data
    )
    return update_lesson


# --- Rutas de evaluaciones ----
@router.post(
    "/courses/{course_id}/lessons/{lesson_id}/evaluations",
    dependencies=[Depends(bearer_scheme)],
)
async def create_evaluation_for_lesson(
    course_id: int,
    lesson_id: int,
    evaluation: EvaluationCreate,
    teacher_services: TeacherServices = Depends(get_teacher_services),
):
    """
    Crea una evaluación para una lección.
    Si es de tipo open_question, se ignoran opciones y correct_answer.
    """
    evaluation_data = evaluation.model_dump()
    evaluation_data["lesson_id"] = lesson_id

    await teacher_services.create_evaluation(evaluation_data)

    return {"message": "Evaluación creada con éxito"}


@router.get(
    "/lessons/{lesson_id}/evaluations",
    dependencies=[Depends(bearer_scheme)],
    tags=["Evaluations"],
)
async def get_evaluation(
    lesson_id: int, teacher_services: TeacherServices = Depends(get_teacher_services)
):
    """Obtiene una evaluación por el ID de la lección."""
    return await teacher_services.get_evaluation_by_lesson_id(lesson_id)


@router.put(
    "/evaluations/{evaluation_id}",
    dependencies=[Depends(bearer_scheme)],
    tags=["Evaluations"],
)
async def update_evaluation(
    evaluation_id: int,
    evaluation: EvaluationUpdate,
    teacher_services: TeacherServices = Depends(get_teacher_services),
):
    """
    Actualiza una evaluación existente. Permite modificar solo la pregunta, solo las opciones,
    solo el correct_answer, o cualquier combinación de estos campos.
    """
    evaluation_data = evaluation.model_dump(exclude_unset=True)

    updated_eval = await teacher_services.update_evaluation(
        evaluation_id, evaluation_data
    )

    return {"message": "Evaluación actualizada con éxito", "evaluation": updated_eval}


# --- Rutas de notificaciones ---


@router.post("/notifications/", dependencies=[Depends(bearer_scheme)])
async def create_notifications(
    notification_data: NotificationCreate,
    services: NotificationService = Depends(get_notification_services),
    teacher: Teacher = Depends(get_current_teacher),
) -> JSONResponse:
    # Aquí deberías añadir una dependencia de seguridad para administradores, ej:
    # current_admin: AdminUser = Depends(get_current_admin_user)
    """
    ## Crear y distribuir nueva notificación a todos los estudiantes

    Permite crear una nueva notificación y la asocia directamente a todos los estudiantes
    registrados en la plataforma.

    ### Parámetros:
    - **notification_data** (`NotificationCreate`): Objeto Pydantic con el título y mensaje de la notificación.

    ### Respuesta:
    - **200 OK**: Notificación creada y distribuida exitosamente a todos los estudiantes.
        ```json
        {
          "message": "Notificación creada y distribuida a todos los estudiantes.",
          "notification_id": 123
        }
        ```
    - **500 Internal Server Error**: Si ocurre un error inesperado al crear o distribuir la notificación.

    ### Seguridad:
    - **IMPORTANTE**: Esta ruta debería estar protegida para que solo administradores o usuarios autorizados puedan usarla.
      Añade una dependencia de autenticación/autorización aquí (ej. `Depends(get_current_admin_user)`).
    """
    response = await services.create_and_distribuite_notification_to_all(
        teacher_id=teacher.id, notification_data=notification_data
    )
    return JSONResponse(content=response, status_code=status.HTTP_200_OK)


@router.get(
    "/notifications/",
    dependencies=[Depends(bearer_scheme)],
    tags=["Notifications"],
    response_model=List[NotificationResponse],
)
async def get_notifications(
    services: TeacherServices = Depends(get_teacher_services),
    teacher: Teacher = Depends(get_current_teacher),
):
    """
    Obtiene todas las notificaciones para un profesor específico.
    """
    return await services.get_notifications_by_teacher_id(teacher.id)


# --- Rutas de estudiantes ---
@router.post(
    "/students/identifications",
    dependencies=[Depends(bearer_scheme)],
    tags=["Students"],
)
async def register_student_identification(
    file: UploadFile = File(...),
    services: TeacherServices = Depends(get_teacher_services),
    teacher: Teacher = Depends(get_current_teacher),
):
    """
    Registra números de identificación de estudiantes desde un archivo.
    Acepta archivos de formato: .txt, .xlsx, .docx
    """
    # Validar tipo de archivo
    allowed_types = [
        "text/plain",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    allowed_extensions = [".txt", ".xlsx", ".docx"]
    file_extension = file.filename.lower().split(".")[-1] if file.filename else ""

    if (
        file.content_type not in allowed_types
        and f".{file_extension}" not in allowed_extensions
    ):
        raise HTTPException(
            status_code=400,
            detail="Formato de archivo no soportado. Solo se permiten archivos .txt, .xlsx, .docx",
        )

    try:
        result = await services.register_students(file)
        return {
            "message": f"Proceso completado. {result['processed']} números procesados, "
            f"{result['successful']} registrados exitosamente, "
            f"{result['duplicates']} duplicados omitidos, "
            f"{result['errors']} errores.",
            "details": result,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error interno del servidor: {str(e)}"
        )
