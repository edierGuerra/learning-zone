# .models/teacher_model.py

from database.config_db import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String
from typing import List

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .course_model import Course
    from .notification_model import Notification


class Teacher(Base):
    """
    Modelo de datos para el profesor.
    """

    __tablename__ = "teachers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(250), nullable=False)

    # Relaciones
    courses: Mapped[List["Course"]] = relationship("Course", back_populates="teacher")
    notifications: Mapped[List["Notification"]] = relationship(
        "Notification", back_populates="teacher"
    )
