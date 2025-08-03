from pydantic import BaseModel


class TeacherSchema(BaseModel):
    id: int
    name: str
    email: str
