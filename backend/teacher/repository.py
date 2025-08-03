""" Repositorio con todos los procesos """

from sqlalchemy.ext.asyncio import AsyncSession


class TeachaerRepo:
    def __init__(self, db: AsyncSession):
        self.db = db
