# models/course_student_model.py
"""
Este módulo define el modelo de datos para la tabla intermedia
que relaciona a los estudiantes con los cursos en los que están inscritos.
"""
# Módulos internos
from database.config_db import Base

# Módulos externo
from sqlalchemy import Column, ForeignKey, Integer, Table

course_student = Table(
    "course_students",
    Base.metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("student_id", ForeignKey("students.id"), primary_key=True),
    Column("course_id", ForeignKey("courses.id"), primary_key=True),
)
