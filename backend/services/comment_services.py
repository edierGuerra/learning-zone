# services/comment_services.py

""" Modulo que se encarga de toda la logica de negocio referente a los comentarios """

from repository.comment_repository import CommentRepo
from schemas.comment_schemas import CommentCreate
from .utils.time_utils import time_since


class CommentService:
    def __init__(self, repo: CommentRepo):
        self.comment_repo = repo

    async def create_comment(self, id_student: int, comment_data: CommentCreate):
        return await self.comment_repo.create_comment(id_student, comment_data)

    async def get_recent_commenter_ids(self, id_course: int, x_minutes: int = 5):
        comments = await self.comment_repo.get_comments_by_course_id(id_course)
        list_students_id = []
        for comment in comments:
            if time_since(comment.timestamp) >= x_minutes:
                list_students_id.append(comment.student_id)

        return list_students_id
