from repository.content_repository import ContentRepo


class ContentService:
    def __init__(self, repo: ContentRepo):
        self.repo = repo

    async def get_contend_by_lesson_id(self, id_course: int, id_lesson: int):
        return await self.repo.get_content(id_course, id_lesson)
