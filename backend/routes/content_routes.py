from fastapi import APIRouter, Depends

from core.security import get_current_student
from models.student_model import Student
from services.content_services import ContentService
from dependencies.content_depencies import get_content_services

router = APIRouter(prefix="/api/v1/student/courses", tags=["Content"])


@router.get("/{id_course}/lessons/{id_lesson}/content")
async def get_content(
    id_course: int,
    id_lesson: int,
    services: ContentService = Depends(get_content_services),
    student: Student = Depends(get_current_student),
):

    contents_lesson = await services.get_contend_by_lesson_id(id_course, id_lesson)

    content_lesson = contents_lesson[0]

    return {
        "status": 200,
        "message": "Conetenido obtenido con éxito",
        "content": {
            "id": content_lesson.id,
            "content_type": content_lesson.content_type,
            "content": content_lesson.content,
            "text": content_lesson.text,
        },
    }
