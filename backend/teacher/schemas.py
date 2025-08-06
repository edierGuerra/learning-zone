from pydantic import BaseModel, model_validator
from typing import List, Optional

from models.evaluation_model import QuestionType


class TeacherSchema(BaseModel):
    id: int
    name: str
    email: str


class LessonCreate(BaseModel):
    name: str
    content_type: str
    text: str


class EvaluationCreate(BaseModel):
    question_type: QuestionType
    question: str
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None

    @model_validator(mode="after")
    def validate_based_on_type(self):
        """
        Valida los campos en función del tipo de pregunta.
        """
        if self.question_type == QuestionType.MULTIPLE_CHOICE:
            if not self.options or len(self.options) < 2:
                raise ValueError(
                    "Las preguntas de opción múltiple requieren al menos dos opciones."
                )
            if not self.correct_answer:
                raise ValueError(
                    "Las preguntas de opción múltiple requieren una respuesta correcta."
                )
        elif self.question_type == QuestionType.OPEN_QUESTION:
            object.__setattr__(self, "options", None)
            object.__setattr__(self, "correct_answer", None)
        return self


class ContentSchema(BaseModel):
    id: int
    content_type: str
    content: Optional[str] = None
    text: Optional[str] = None

    class Config:
        from_attributes = True


class LessonCResponse(BaseModel):
    id: int
    name: str
    contents: List[ContentSchema]

    class Config:
        from_attributes = True


# async def create_evaluation_for_lesson(
#     course_id: int,
#     lesson_id: int,
#     question_type: QuestionType = Form(...),
#     question: str = Form(...),
#     options: Optional[str] = Form(None),  # String JSON del frontend
#     correct_answer: Optional[str] = Form(None),
