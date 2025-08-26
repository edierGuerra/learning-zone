from fastapi import APIRouter, Depends, HTTPException, status
from dependencies.course_dependencie import get_course_services
from services.course_services import CourseServices
from models.course_model import CourseCategoryEnum
from models.student_model import Student
from core.security import get_current_student


router = APIRouter(prefix="/api/v1/student/courses", tags=["Courses"])


@router.get("/list")
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

    return {"status": 200, "message": "Exito al obtener los cursos", "courses": courses}


@router.get("/category/{category}")
async def get_courses_by_category(
    category: CourseCategoryEnum,
    student: Student = Depends(get_current_student),
    course_services: CourseServices = Depends(get_course_services),
):
    """
    ## Obtener cursos por categoría

    Obtiene los cursos de un estudiante filtrados por categoría.

    ### Parámetros:
    - `category(str)`: Categoría por la que filtrar los cursos.
    - `student(Student)`: Objeto de tipo estudiante obtenido a partir del token del estudiante.

    ### Retorno:
    - `List[Course]`: Lista de cursos o lista vacía en caso de error.
    """
    courses = await course_services.get_courses_by_category(student.id, category)

    if not courses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se han podido obtener los cursos del estudiante",
        )

    return {"status": 200, "message": "Exito al obtener los cursos", "courses": courses}
