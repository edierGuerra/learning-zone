from dependencies.comment_dependencies import get_comment_services
from services.comment_services import CommentService
from schemas.comment_schemas import (
    CommentCreate,
    CommentListResponse,
    CommentResponseFull,
)
from core.security import get_current_student
from models import Student

from fastapi import APIRouter, Depends


router = APIRouter(prefix="/api/v1/comments", tags=["Comments"])


@router.post("/", response_model=CommentResponseFull)
async def create_comment(
    comment_data: CommentCreate,
    student: Student = Depends(get_current_student),
    comment_service: CommentService = Depends(get_comment_services),
):

    new_comment = await comment_service.create_comment(student.id, comment_data)

    list_id_of_students = await comment_service.get_recent_commenter_ids(
        id_course=new_comment.course_id
    )

    return {
        "comment": {
            "id": new_comment.id,
            "name_student": new_comment.student.names,
            "text": new_comment.text,
            "timestamp": new_comment.timestamp,
            "parent_id": new_comment.parent_id,
            "course_id": new_comment.course_id,
            "student_id": new_comment.student_id,
        },
        "list_ids_connects": list_id_of_students,
    }


@router.get("/", response_model=CommentListResponse)
async def get_comments(
    course_id: int,
    student: Student = Depends(get_current_student),
    comment_service: CommentService = Depends(get_comment_services),
):
    comments = await comment_service.get_comments_by_course_id(id_course=course_id)
    list_id_of_students = await comment_service.get_recent_commenter_ids(
        id_course=course_id
    )
    return {"comments": comments, "list_ids_connects": list_id_of_students}
