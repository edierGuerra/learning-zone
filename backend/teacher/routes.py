"""
teacher/routes.py

Este modulo contiene todas la rutas con las diferentes operaciones que puede realizar el profesor
"""

from fastapi import APIRouter, Depends, Form, UploadFile, File
from fastapi.security import HTTPBearer

from schemas.lesson_schemas import LessonPResponse
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
    image: UploadFile = File(None),
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
    return {"message": "Curso actualizado con exito.", "course": updated_course}


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


@router.get("/courses/all", dependencies=[Depends(bearer_scheme)], tags=["Courses"])
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
