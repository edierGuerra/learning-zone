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
            if time_since(comment.timestamp) <= x_minutes:
                list_students_id.append(comment.student_id)

        return list_students_id

    async def get_comments_by_course_id(self, id_course: int) -> list:
        comments = await self.comment_repo.get_comments_by_course_id(id_course)
        list_comments = []
        for comment in comments:
            list_comments.append(
                {
                    "id": comment.id,
                    "name_student": comment.student.names,
                    "text": comment.text,
                    "timestamp": comment.timestamp,
                    "parent_id": comment.parent_id,
                    "course_id": comment.course_id,
                    "student_id": comment.student_id,
                }
            )
        return list_comments

    async def delete_comment(self, id_comment: int, id_student: int):
        """Permite eliminar un comentario en base a su id y el del estudiante"""
        comment = await self.comment_repo.delete_comment(id_comment, id_student)
        return {
            "id": comment.id,
            "course_id": comment.course_id,
            "parent_id": comment.parent_id,
            "name_student": comment.student.names,
            "student_id": comment.student_id,
            "timestamp": comment.timestamp,
            "text": comment.text,
        }

    async def update_comment(self, id_comment: int, id_student: int, new_text: str):
        """Permite actualizar un comentario"""
        comment = await self.comment_repo.update_comment(
            id_comment, id_student, new_text
        )
        return {
            "id": comment.id,
            "course_id": comment.course_id,
            "parent_id": comment.parent_id,
            "name_student": comment.student.names,
            "student_id": comment.student_id,
            "timestamp": comment.timestamp,
            "text": comment.text,
        }
