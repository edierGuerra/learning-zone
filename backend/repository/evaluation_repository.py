# repository/evaluation_repository.py

"""
Este módulo define el repositorio para la gestión de datos de evaluaciones
en la base de datos. Proporciona métodos para interactuar directamente
con el modelo Evaluation, realizando operaciones de consulta
"""

import logging
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

# Modulos internos
from models.evaluation_model import Evaluation

logger = logging.getLogger(__name__)


class EvaluationRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_evaluation_by_lesson_id(
        self, lesson_id: int
    ) -> Optional[Evaluation]:  # Trae un objeto Evaluation si se encuentra, sino None
        """
        Funcion que permite obtener la evaluación de una lección especifica
        """
        try:
            stmt = select(Evaluation).where(Evaluation.lesson_id == lesson_id)
            result = await self.db.execute(stmt)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(
                f"Error al obtener evaluación para la alección {lesson_id}: {e}",
                exc_info=True,
            )
            raise  # Re-lanza la excepción para que sea manejada por el servicio/ruta
