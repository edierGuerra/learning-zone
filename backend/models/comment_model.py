# comment_model.py
"""
Este módulo define el modelo de datos para los comentarios registrados en la base de datos.
Incluye atributos esenciales como el identificador único y la descripción del comentario,
utilizando SQLAlchemy para la gestión ORM.
"""

# Módulos internos
from database.config_db import Base

# Módulos externos
from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .student_model import Student
    from .course_model import Course


class Comment(Base):
    __tablename__ = "comments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    description: Mapped[str] = mapped_column(String(250), nullable=False)

    # Claves Foraneas
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"))
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"))

    # Relaciones
    student: Mapped["Student"] = relationship(back_populates="comments")
    course: Mapped["Course"] = relationship(back_populates="comments")
