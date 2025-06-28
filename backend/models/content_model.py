#models/content_model.py
'''
Este módulo define el modelo de datos para los contenidos de las lecciones,
como videos o documentos, incluyendo su tipo y URL.
'''

# Módulos externos
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

# Módulos internos
from database.config_db import Base

class Content(Base):
    __tablename__ = 'contents'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    content_type: Mapped[str] = mapped_column(String(50)) # tipo
    url: Mapped[str] = mapped_column(String(150)) # url
    lesson_id: Mapped[int] = mapped_column(Integer) # id_leccion (foreign key)