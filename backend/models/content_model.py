#models/content_model.py
'''
Este módulo define el modelo de datos para los contenidos de las lecciones,
como videos o documentos, incluyendo su tipo y URL.
'''

# Módulos externos
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Módulos internos
from database.config_db import Base

class Content(Base):
    __tablename__ = 'contents'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    content_type: Mapped[str] = mapped_column(String(50)) # tipo
    url: Mapped[str] = mapped_column(String(150)) # url
    
    # Claves foraneas
    lesson_id: Mapped[int] = mapped_column(ForeignKey('lessons.id')) # id_leccion (foreign key)
    
    # Relaciones
    lesson: Mapped['Lesson'] = relationship(back_populates='contents')