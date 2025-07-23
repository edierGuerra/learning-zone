/* Encabezado del curso */
import '../styles/HeaderCourse.css'
import { BsChatLeftTextFill } from "react-icons/bs";
import { useCourseContext } from '../hooks/useCourse';
import GetAllStudentsCommentsAPI from '../services/GetAllStudentsComments.server';
import { authStorage } from '../../../shared/Utils/authStorage';
import type { TStudentAllComents } from '../comments/types';
import { useNavigate } from 'react-router-dom';
/* Componnete reutilizable que muestra el header del curso */
type THeaderCourseProps ={
    title:'Excel' | 'Word' | 'Power-Point ';
}
export default function HeaderCourse({title}:THeaderCourseProps) {
    const {progress} = useCourseContext() 
    const navigate = useNavigate();

    const handleComment = async () => {
      const students = await GetAllStudentsCommentsAPI();
      const studentStorage: TStudentAllComents[] = students.map((student) => ({
        id: student.id,
        numIdentification: student.num_identification,
        name: student.name,
        lastNames: student.last_names,
        email: student.email,
        prefixProfile: student.prefix_profile,
        stateConnect: false
      }));
      authStorage.setAllStudents(studentStorage);
      // Buscar el id del curso por nombre
      const cursos = authStorage.getCourses();
      // Normalizar el nombre para comparar (sin espacios y minúsculas)
      const normalizedTitle = title.trim().toLowerCase().replace(/[\s-]+/g, '');
      const curso = cursos.find(c => c.name.trim().toLowerCase().replace(/[\s-]+/g, '') === normalizedTitle);
      if (curso) {
        navigate(`/comments/${curso.id}`);
      } else {
        alert('No se encontró el curso correspondiente.');
      }
    }

  return (
    <div className='header-course'>
        <button className='btn-chat-course' onClick={handleComment}><BsChatLeftTextFill style={{'background':'none'}}/></button>
        <h2 className={`title-course ${title}`}>Curso basico de {title}</h2>
        <div className="container-progress">
            <p className='progress-course-number'>{progress}</p>
            <span className="progress-bar-bg"></span>
            <span className={`progress-bar-fill-${title}`} style={{ width: `${progress}%` }}></span>
        </div>
        {/* Agregar sections */}    
    </div>
  )
}
