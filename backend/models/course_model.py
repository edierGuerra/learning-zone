# models/course_model.py
"""
Este módulo define el modelo de datos para los cursos ofrecidos,
incluyendo el nombre y la descripción de cada curso.
"""
from typing import List

# Módulos internos

from database.config_db import Base

# Módulos externos
from sqlalchemy import Boolean, Enum, Integer, String, JSON, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship


from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .comment_model import Comment
    from .student_model import Student
    from .lesson_model import Lesson
    from teacher.model import Teacher

import enum


class CourseCategoryEnum(enum.Enum):
    OFFICE = "ofimatica"
    ELECTRONICS = "electronica"
    PROGRAMMING = "programacion"
    DESIGN = "diseño"
    CYBERSECURITY = "ciberseguridad"
    GAME_DEVELOPMENT = "desarrollo de videojuegos"
    AI_ML = "inteligencia artificial"
    WEB_DEVELOPMENT = "desarrollo web"
    OTHER = "otro"


class Course(Base):
    __tablename__ = "courses"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50))  # nombre del curso
    description: Mapped[str] = mapped_column(String(100))  # descripcion del curso
    name_palette: Mapped[str] = mapped_column(
        String(50), nullable=True
    )  # nombre de la paleta de colores
    palette: Mapped[dict[str, str]] = mapped_column(
        JSON, nullable=True
    )  # colores del curso
    image: Mapped[str] = mapped_column(Text, nullable=True)  # imagen del curso
    category: Mapped[CourseCategoryEnum] = mapped_column(
        Enum(CourseCategoryEnum), nullable=False
    )  # categoria del curso
    is_published: Mapped[bool] = mapped_column(
        Boolean, default=False
    )  # curso publicado

    # clave foranea
    teacher_id: Mapped[int] = mapped_column(
        ForeignKey("teachers.id")
    )  # clave foranea al profesor

    # Relaciones
    comments: Mapped[List["Comment"]] = relationship(back_populates="course")
    students: Mapped[List["Student"]] = relationship(
        secondary="course_students", back_populates="courses"
    )
    lessons: Mapped[List["Lesson"]] = relationship(back_populates="course")
    teacher: Mapped["Teacher"] = relationship(
        "Teacher", back_populates="courses"
    )  # Relación con el profesor, un curso tiene un solo profesor

    def __repr__(self) -> str:
        return (
            f"<Course(id={self.id}, name={self.name}, description={self.description})>"
        )
