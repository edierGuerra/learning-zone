#models/progress_model.py
'''
Este módulo define el modelo de datos para el progreso de los estudiantes,
registrando el estado de avance de un estudiante en una lección específica.
Esta módulo sirve como tabla de asosiación.
'''

# Módulos externos
from sqlalchemy import Integer, Boolean, Table, Column, ForeignKey

# Módulos internos
from database.config_db import Base

progress_model = Table(
    'progress',
    Base.metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('student_id', ForeignKey('students.id'), primary_key=True),
    Column('lesson_id', ForeignKey('lessons.id'), primary_key=True)
)