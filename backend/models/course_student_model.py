#models/course_student_model.py
'''
Este módulo define el modelo de datos para la tabla intermedia
que relaciona a los estudiantes con los cursos en los que están inscritos.
'''
# Módulos externo
from sqlalchemy import Integer
from sqlalchemy.orm import Mapped,mapped_column

# Módulos internos
from database.config_db import Base

class CourseStudent(Base):
    __tablename__ = 'course_students'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(Integer) # id_estudiante (foreign key)
    course_id: Mapped[int] = mapped_column(Integer) # id_curso (foreign key)