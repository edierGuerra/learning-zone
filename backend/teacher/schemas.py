from pydantic import BaseModel


class TeacherSchema(BaseModel):
    id: int
    name: str
    email: str


class LessonCreate(BaseModel):
    name: str
    content_type: str
    text: str
