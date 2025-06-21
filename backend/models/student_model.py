# student_model.py
""" 
Este módulo incluye el modelo de datos del estudiante, estructurado para facilitar su mapeo eficiente y preciso en la base de datos, 
garantizando una representación coherente y optimizada de la información.
"""

# Modulos externos
from sqlalchemy import Boolean, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Modulos internos
from database.config_db import Base

class Student(Base):
    __tablename__ = "students"
    id:Mapped[int] = mapped_column(Integer,primary_key=True, autoincrement=True)
    identification_number:Mapped[int] = mapped_column(Integer,nullable=False, unique=True)
    names:Mapped[str] = mapped_column(String(50),nullable=False)
    last_names:Mapped[str] = mapped_column(String(50),nullable=False)
    email:Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    password:Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Claves foraneas
    identification_id:Mapped[int] = mapped_column(ForeignKey("identifications.id"), unique=True, nullable=False)
    
    # Relaciones
    identification:Mapped["Identification"] = relationship(back_populates="student", uselist=False)
    
    # Validación de correo
    email_token: Mapped[str] = mapped_column(String(255), nullable=True, unique=True, comment="Token único para verificación de correo")
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, comment="Indica si el correo fue verificado")