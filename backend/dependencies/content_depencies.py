# Modulos internos
from database.config_db import get_session

# Modulos externos
from fastapi import Depends
from repository.content_repository import ContentRepo
from services.content_services import ContentService
from sqlalchemy.ext.asyncio import AsyncSession


def get_content_services(
    session: AsyncSession = Depends(get_session),
) -> ContentService:
    repository = ContentRepo(session)
    return ContentService(repository)
