# identification_model.py

"""
Este modulo incluye el modelo de datos de identificacion del estudiante, estructurado para facilitar
el acceso a los estudiantes del grado 11 de la institucion de forma especifica
"""

# modulos internos
from database.config_db import Base

# modulos externos
from sqlalchemy import Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .student_model import Student


class Identification(Base):
    __tablename__ = "identifications"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    n_identification: Mapped[int] = mapped_column(Integer, nullable=False, unique=True)

    # Relaciones
    student: Mapped["Student"] = relationship(
        "Student",
        back_populates="identification",
        uselist=False,
        cascade="all, delete-orphan",
    )
