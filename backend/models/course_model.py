#models/course_model.py
'''
Este módulo define el modelo de datos para los cursos ofrecidos,
incluyendo el nombre y la descripción de cada curso.
'''
# Módulos externos
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

# Módulos internos
from database.config_db import Base

class Course(Base):
    __tablename__ = 'courses' 
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50)) # nombre del curso 
    description: Mapped[str] = mapped_column(String(100)) # descripcion del curso