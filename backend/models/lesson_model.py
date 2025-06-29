#models/lesson_model.py
'''
Este módulo define el modelo de datos para las lecciones de los cursos,
incluyendo su nombre y descripción.
'''
# Módulos externos
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

# Módulos internos
from database.config_db import Base
from .progress_model import progress_model

class Lesson(Base):
    __tablename__ = 'lessons' # Comillas simples aquí
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50)) # nombre
    description: Mapped[str] = mapped_column(String(100)) # descripcion
    course_id: Mapped[int] = mapped_column(Integer) # id_curso (foreign key)
    
    # Claves Foraneas
    id_course:Mapped[int] = mapped_column(ForeignKey('courses.id'))
    
    # Relaciones
    course: Mapped['Course'] = relationship(back_populates='lessons')
    students: Mapped[List['Student']] = relationship(back_populates='lessons', secondary=progress_model)
    contents: Mapped[List['Content']] = relationship(back_populates='lesson')
