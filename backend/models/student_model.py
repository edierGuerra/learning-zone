# student_model.py
"""
Este módulo incluye el modelo de datos del estudiante, estructurado para facilitar su mapeo eficiente y preciso en la base de datos,
garantizando una representación coherente y optimizada de la información.
"""

# Modulos externos
from typing import List
from datetime import datetime

# Modulos internos
from .student_notification_model import student_notification
from .student_answer_model import student_answer
from database.config_db import Base
from sqlalchemy import Boolean, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .course_student_model import course_student
from .progress_model import progress_model
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .identification_model import Identification
    from .comment_model import Comment
    from .course_model import Course
    from .lesson_model import Lesson
    from .notification_model import Notification
    from .evaluation_model import Evaluation


class Student(Base):
    __tablename__ = "students"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    identification_number: Mapped[int] = mapped_column(
        Integer, nullable=False, unique=True
    )
    names: Mapped[str] = mapped_column(String(50), nullable=False)
    last_names: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)

    # Claves foraneas
    identification_id: Mapped[int] = mapped_column(
        ForeignKey("identifications.id"), unique=True, nullable=False
    )

    # Relaciones
    identification: Mapped["Identification"] = relationship(
        back_populates="student", uselist=False
    )
    comments: Mapped[List["Comment"]] = relationship(back_populates="student")
    course: Mapped[List["Course"]] = relationship(
        back_populates="students", secondary=course_student
    )
    lessons: Mapped[List["Lesson"]] = relationship(
        back_populates="students", secondary=progress_model
    )

    # Validación de correo
    email_token: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
        unique=True,
        comment="Token único para verificación de correo",
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean, default=False, comment="Indica si el correo fue verificado"
    )
    identification: Mapped["Identification"] = relationship(
        back_populates="student", uselist=False
    )
    notifications: Mapped[List["Notification"]] = relationship(
        secondary=student_notification, back_populates="students"
    )  # Relacion con student_notfication hacia notification_Model
    evaluations: Mapped[List["Evaluation"]] = relationship(
        secondary=student_answer, back_populates="students"
    )  # relacion con student_answer_model hacia evaluation_model

    # Validación de correo
    email_token: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
        unique=True,
        comment="Token único para verificación de correo",
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean, default=False, comment="Indica si el correo fue verificado"
    )

    # Validación de contraseña
    password_token: Mapped[str] = mapped_column(
        String(250),
        unique=True,
        nullable=True,
        comment="Token para validar el cambio de contraseña",
    )
    expire_password_token: Mapped[datetime] = mapped_column(
        DateTime,
        unique=True,
        nullable=True,
        comment="Tiempo de expiración del token de recuperación de contraseña",
    )
