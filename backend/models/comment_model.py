# comment_model.py
'''
Este módulo define el modelo de datos para los comentarios registrados en la base de datos.
Incluye atributos esenciales como el identificador único y la descripción del comentario,
utilizando SQLAlchemy para la gestión ORM.
'''

# Módulos externos
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Módulos internos
from database.config_db import Base

class Comment(Base):
    __tablename__ = 'comments'
    id:Mapped[int] = mapped_column(Integer,primary_key=True, autoincrement=True)
    description:Mapped[str] = mapped_column(String(250), nullable=False)