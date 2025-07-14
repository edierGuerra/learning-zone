from fastapi import APIRouter, Depends, HTTPException, status
from dependencies.course_dependencie import get_course_services
from services.course_services import CourseServices
from core.security import get_current_student
from models.student_model import Student


router = APIRouter(prefix="/api/v1/student/courses", tags=["Courses"])


@router.get("/")
async def get_courses(
    student: Student = Depends(get_current_student),
    course_services: CourseServices = Depends(get_course_services),
):
    """
    ## Obtener cursos

    Obtiene los cursos del estudiante en base a su token de acceso.

    ### Parámetros:
    - `student(Student)`: Objeto de tipo estudiante obtenido a partir del token del estudiante.

    ### Retorno:
    - `List[Course]`: Lista de cursos o lista vacía en caso de error.

    Nota:
    La lista de cursos es rotornada dentro de un JSON.
    """
    courses = await course_services.get_courses_by_student_id(student.id)

    if not courses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se han podido obtener los cursos del estudiante",
        )

    return {"message": "Exito al obtener los cursos", "data": courses}
