#models/progress_model.py
'''
Este módulo define el modelo de datos para el progreso de los estudiantes,
registrando el estado de avance de un estudiante en una lección específica.
'''

# Módulos externos
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

# Módulos internos
from database.config_db import Base

class Progress(Base):
    __tablename__ = 'progress'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(Integer) # id_estudiante (foreign key)
    lesson_id: Mapped[int] = mapped_column(Integer) # id_leccion (foreign key)
    status: Mapped[str] = mapped_column(String(50)) # estado