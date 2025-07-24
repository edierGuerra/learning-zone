# models/course_student_model.py
"""
Este módulo define el modelo de datos para la tabla intermedia
que relaciona a los estudiantes con los cursos en los que están inscritos.
incluye el progreso del curso para cada estudiante.
"""
# Módulos internos
from enum import Enum
from database.config_db import Base
from sqlalchemy import Column, ForeignKey, Enum as SqlEnum


class StateCourse(str, Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class CourseStudentAssociation(Base):
    __tablename__ = "course_students"

    student_id: int = Column(ForeignKey("students.id"), primary_key=True)
    course_id: int = Column(ForeignKey("courses.id"), primary_key=True)

    status: StateCourse = Column(
        SqlEnum(StateCourse, name="state_course_enum", create_type=True),
        nullable=False,
        default=StateCourse.IN_PROGRESS,
    )
