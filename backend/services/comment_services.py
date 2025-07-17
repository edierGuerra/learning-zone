# services/comment_services.py

""" Modulo que se encarga de toda la logica de negocio referente a los comentarios """

from repository.comment_repository import CommentRepo
from schemas.comment_schemas import CommentCreate


class CommentService:
    def __init__(self, repo: CommentRepo):
        self.comment_repo = repo

    async def create_comment(self, id_student: int, comment_data: CommentCreate):
        return await self.comment_repo.create_comment(id_student, comment_data)
