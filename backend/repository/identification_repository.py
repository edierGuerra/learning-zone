from models.identification_model import Identification
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


class IdentificationRepository:
    """
    Repositorio encargado de acceder a los datos del modelo 'Identification' en la base de datos.

    Este patrón organiza las operaciones relacionadas con la persistencia de datos,
    separándolas de la lógica de negocio y de las rutas (API).
    Centraliza todas las conexiones a la base de datos separandolas del resto

    - Esta clase retornara Un objeto del modelo 'Identification' si se encuentra, sino devuelve None.
    """

    @staticmethod  # especifica una funcion normal dentro de una clase
    async def get_by_code(
        session: AsyncSession, code: int
    ) -> (
        Identification | None
    ):  # esta funcion devuelve un objeto de tipo Identification o None
        # Buscar el número de identificación en la base de datos
        result = await session.execute(  # Gracias a session no hay necesidad de abrir o cerrar manualmente la conexión.
            select(Identification).where(Identification.n_identification == code)
            # select moderno de sqlalchemy +1.4 compatible con programacion asincrona para no escribir consultas sql crudas
        )
        return result.scalars().first()
        # scalars extrae solo el objeto modelo (evita tuplas complejas o innecesarias).
        # first trae el primer resultado o none
