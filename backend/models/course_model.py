# models/course_model.py
"""
Este módulo define el modelo de datos para los cursos ofrecidos,
incluyendo el nombre y la descripción de cada curso.
"""
from typing import List

# Módulos internos
from database.config_db import Base
from .course_student_model import course_student

# Módulos externos
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .comment_model import Comment
    from .student_model import Student
    from .lesson_model import Lesson


class Course(Base):
    __tablename__ = "courses"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50))  # nombre del curso
    description: Mapped[str] = mapped_column(String(100))  # descripcion del curso

    # Relaciones
    comments: Mapped[List["Comment"]] = relationship(back_populates="course")
    students: Mapped[List["Student"]] = relationship(
        back_populates="course", secondary=course_student
    )
    lessons: Mapped[List["Lesson"]] = relationship(back_populates="course")
