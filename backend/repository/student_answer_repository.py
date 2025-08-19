# repository/student_answer_repository.py

# Modulos externos
import logging
from typing import Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

# Modulos internos
from models.evaluation_model import Evaluation
from models.lesson_model import Lesson
from models.student_answer_model import StudentAnswer

logger = logging.getLogger(__name__)


class StudentAnswerRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_student_answer(
        self, student_answer_obj: StudentAnswer
    ) -> StudentAnswer:
        """
        Guarda una nueva respuesta del estudiante en la base de datos.
        """
        self.db.add(student_answer_obj)
        await self.db.flush()  # Para que el objeto tenga su ID despues de la adición, antes del commit
        return student_answer_obj

    async def get_total_score_for_student(self, student_id: int) -> float:
        """
        Calcula la sumatoria de todos los scores obtenidos por un estudiante
        de todas sus respuestas registradas.
        """
        result = await self.db.execute(
            select(func.sum(StudentAnswer.score)).where(
                StudentAnswer.student_id == student_id
            )
        )
        total_score = result.scalar_one_or_none()
        return total_score if total_score is not None else 0.0

    async def get_student_answer_for_evaluation(
        self, student_id: int, evaluation_id: int
    ) -> Optional[StudentAnswer]:  # puede no ser necesario
        """
        Obtiene la última respuesta de un estudiante para una evaluación específica.
        """
        stmt = (
            select(StudentAnswer)
            .where(
                StudentAnswer.student_id == student_id,
                StudentAnswer.evaluation_id == evaluation_id,
            )
            .order_by(StudentAnswer.answered_at.desc())
        )  # Obtener la mas reciente
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_total_score_for_student_in_course(
        self, student_id: int, course_id: int
    ) -> float:
        """
        Suma todos los scores de un estudiante en un curso específico.
        """
        result = await self.db.execute(
            select(func.sum(StudentAnswer.score))
            .join(Evaluation, StudentAnswer.evaluation_id == Evaluation.id)
            .join(Lesson, Evaluation.lesson_id == Lesson.id)
            .where(
                StudentAnswer.student_id == student_id, Lesson.id_course == course_id
            )
        )
        total_score = result.scalar_one_or_none()
        return total_score if total_score is not None else 0.0
