# comment_model.py
"""
Modelo ORM para los comentarios registrados en la base de datos.

Incluye relaciones con estudiantes y cursos, soporte para comentarios anidados
(parent_id), y una marca de tiempo (timestamp) para la ordenación cronológica.
"""

# Módulos internos
from database.config_db import Base

# Módulos externos
from sqlalchemy import ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .student_model import Student
    from .course_model import Course


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    text: Mapped[str] = mapped_column(String(1000), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    parent_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("comments.id"), nullable=True
    )

    # Relaciones
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"))
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"))

    student: Mapped["Student"] = relationship(back_populates="comments")
    course: Mapped["Course"] = relationship(back_populates="comments")
    parent: Mapped[Optional["Comment"]] = relationship(
        "Comment", remote_side=[id], backref="replies"
    )
