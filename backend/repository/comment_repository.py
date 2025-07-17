# repository/comment_repository.py

"""Este módulo contiene los procedimientos de base de datos relacionados con comentarios."""

import logging
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.comment_schemas import CommentCreate
from models.comment_model import Comment

logger = logging.getLogger(__name__)  # Objeto para tirar logs


class CommentRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_comment(self, comment_data: CommentCreate) -> Comment:
        """
        Crea un nuevo comentario en la base de datos.

        Args:
            comment_data (CommentCreate): Esquema con los datos del comentario.

        Returns:
            Comment: Comentario guardado en la base de datos.
        """
        try:
            dict_comment_data = comment_data.model_dump()

            new_comment = Comment(**dict_comment_data)

            self.db.add(new_comment)
            await self.db.commit()
            await self.db.refresh(new_comment)

            return new_comment
        except Exception as e:
            logger.error(f"[ERROR]: Ha ocurrido un error interno: {e}", exc_info=True)
            await self.db.rollback()
            raise
