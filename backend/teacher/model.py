from database.config_db import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String


class Teacher(Base):
    """
    Modelo de datos para el profesor.
    """

    __tablename__ = "teachers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(250), nullable=False)

    def __repr__(self):
        return f"<Teacher(id={self.id}, name={self.name}, email={self.email})>"
