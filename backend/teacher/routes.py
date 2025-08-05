"""
teacher/routes.py

Este modulo contiene todas la rutas con las diferentes operaciones que puede realizar el profesor
"""

from typing import Optional
from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException
from fastapi.security import HTTPBearer

from schemas.lesson_schemas import LessonPResponse
from teacher.model import Teacher
from .service import TeacherServices
from models.course_model import CourseCategoryEnum
from models.content_model import TypeContent
from models.evaluation_model import QuestionType
from .dependencies import get_teacher_services
import json
from .oauth import get_current_teacher
from .utils import generate_profile_prefix

router = APIRouter(prefix="/api/v1/teachers", tags=["Teachers"])


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
)
async def delete_course(
    course_id: int,
    teacher_services: TeacherServices = Depends(get_teacher_services),
):
    """Elimina un curso por su ID."""
    return await teacher_services.delete_course(course_id)


@router.patch("/{course_id}")
async def publish_course(
    course_id: int, teacher_services: TeacherServices = Depends(get_teacher_services)
):
    """Publica un curso, haciendolo visible para los estudiantes."""
    return await teacher_services.publish_course(course_id=course_id)


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


@router.post(
    "/courses/{course_id}/lessons",
    response_model=LessonPResponse,
    dependencies=[Depends(bearer_scheme)],
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


@router.post(
    "/courses/{course_id}/lessons/{lesson_id}/evaluations",
    dependencies=[Depends(bearer_scheme)],
)
async def create_evaluation_for_lesson(
    course_id: int,
    lesson_id: int,
    question_type: QuestionType = Form(...),
    question: str = Form(...),
    options: str = Form(...),  # String JSON del frontend
    correct_answer: Optional[str] = Form(None),
    teacher_services: TeacherServices = Depends(get_teacher_services),
):
    """
    Crea una evaluación para una lección.
    Si es de tipo open_question, se ignoran opciones y correct_answer.
    """
    # Parsea las opciones si es de opción múltiple
    # Validar y parsear las opciones solo si es multiple_choice
    parsed_options = None
    if question_type == QuestionType.MULTIPLE_CHOICE:
        if options:
            try:
                options = json.dumps(options)
                parsed_options = json.loads(options)
                if not isinstance(parsed_options, list) or len(parsed_options) < 2:
                    raise HTTPException(
                        status_code=400,
                        detail="Debes enviar al menos dos opciones válidas como lista.",
                    )
            except json.JSONDecodeError:
                raise HTTPException(
                    status_code=400,
                    detail='El campo \'options\' debe ser un JSON válido (ej: ["a", "b"]).',
                )
        else:
            raise HTTPException(
                status_code=400,
                detail="El campo 'options' es requerido para preguntas de opción múltiple.",
            )

        if not correct_answer:
            raise HTTPException(
                status_code=400,
                detail="El campo 'correct_answer' es requerido para preguntas de opción múltiple.",
            )

    # Preparar el payload de creación
    evaluation_data = {
        "lesson_id": lesson_id,
        "question_type": question_type,
        "question": question,
        "options": (
            parsed_options if question_type == QuestionType.MULTIPLE_CHOICE else None
        ),
        "correct_answer": (
            correct_answer if question_type == QuestionType.MULTIPLE_CHOICE else None
        ),
    }

    new_eval = await teacher_services.create_evaluation(evaluation_data)

    return {"message": "Evaluación creada con éxito", "evaluation": new_eval}
