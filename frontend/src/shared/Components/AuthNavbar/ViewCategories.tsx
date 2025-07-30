/* Componente que renderiza la ventana donde se ve excel word y power Point */
import toast from 'react-hot-toast';
import { useStudentCourseContext } from '../../../modules/courses/hooks/useCourse'
import GetCoursesByCategoryAPI from '../../../modules/courses/services/GetCoursesByCategory.server';
import type { TCourse } from '../../../modules/courses/types/Course';
import './Styles/ViewCategories.css'

export default function ViewCategories() {
  const {courses,setCourses} = useStudentCourseContext()

  const handleGetCoursesCategory=async(category:TCourse['category'])=>{
    /* Usar el servicio que obtiene los cursos con la respectiva categoria */
    const courses = await GetCoursesByCategoryAPI(category)
    /* Posteriormente setear estos cursos en el estado del contexto para que el home de student de cambie a los que el busco */
    setCourses(courses)
    toast.success(`Cursos de ${category}`)
  }
  /* Traer las categorias que existen en el momento en todos los cursos */
  // Extrae todas las categorías únicas de los cursos (sin duplicados)
  const categories = [
  // Convierte el Set (que elimina duplicados) nuevamente a un array
  ...new Set( /* Set es una estructura que elimina automáticamente los valores repetidos, Usa el operador spread (...) para convertir el Set nuevamente en un array normal. */
    // Genera un array con solo las categorías de cada curso
    courses.map(course => course.category)
  )
];



  return (
    <div className='container-view-categories'>
      {/* Renderizar las categorias */}
      {categories.map((category)=>(
        <button className='btn-category' onClick={()=>handleGetCoursesCategory(category)}>{category}</button>
      ))}

    </div>
  )
}
