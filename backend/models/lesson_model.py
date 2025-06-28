#models/lesson_model.py
'''
Este módulo define el modelo de datos para las lecciones de los cursos,
incluyendo su nombre y descripción.
'''
# Módulo: LessonModel
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from database.config_db import Base

class Lesson(Base):
    __tablename__ = 'lessons' # Comillas simples aquí
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50)) # nombre
    description: Mapped[str] = mapped_column(String(100)) # descripcion
    course_id: Mapped[int] = mapped_column(Integer) # id_curso (foreign key)