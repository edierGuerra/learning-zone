from repository.course_repository import CourseRepository
from repository.student_repository import StudentRepository
from typing import List
from models.course_model import Course


class CourseServices:
    def __init__(
        self, course_repository: CourseRepository, student_repository: StudentRepository
    ) -> None:
        self.course_repository = course_repository
        self.student_repository = student_repository

    async def get_courses_by_student_id(self, id_student: int) -> List[Course]:
        """
        Retorna los cursos del estudiante si existen, de lo contrario retorna una lista vacía.
        """
        courses = []
        all_courses = await self.course_repository.get_courses_by_student_id(
            id_student, student_repo=self.student_repository
        )
        if all_courses:
            for course in all_courses:
                if course.get("published"):
                    courses.append(course)
        return courses
