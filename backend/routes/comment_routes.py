from dependencies.comment_dependencies import get_comment_services
from models.student_model import Student
from services.comment_services import CommentService
from schemas.comment_schemas import CommentCreate, CommentResponseFull
from core.security import get_current_student

from fastapi import APIRouter, Depends


router = APIRouter(prefix="/api/v1/comments", tags=["Comments"])


@router.post("/", response_model=CommentResponseFull)
async def create_comment(
    comment_data: CommentCreate,
    student: Student = Depends(get_current_student),
    comment_services: CommentService = Depends(get_comment_services),
):

    new_comment = await comment_services.create_comment(student.id, comment_data)

    list_id_of_students = await comment_services.get_recent_commenter_ids(
        id_course=new_comment.course_id
    )

    return {
        "comment": {
            "id": new_comment.id,
            "nameStudent": new_comment.student.names,
            "text": new_comment.text,
            "timestamp": new_comment.timestamp,
            "parentId": new_comment.parent_id,
            "courseId": new_comment.course_id,
            "studentId": new_comment.student_id,
        },
        "listIdsConnects": list_id_of_students,
    }
