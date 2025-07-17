/* Encabezado del curso */
import '../styles/HeaderCourse.css'
import { BsChatLeftTextFill } from "react-icons/bs";
import { useNavigationHandler } from "../../../hooks/useNavigationHandler";
import { useCourseContext } from '../hooks/useCourse';
import GetAllStudentsCommentsAPI from '../services/GetAllStudentsComments.server';
import { authStorage } from '../../../shared/Utils/authStorage';
import type { TStudentAllComents } from '../comments/types';
/* Componnete reutilizable que muestra el header del curso */
type THeaderCourseProps ={
    title:'Excel' | 'Word' | 'Power-Point ';
    chatTo: '/commentsWord' | '/commentsExcel' | '/commentsPowerPoint';
}
export default function HeaderCourse({title,chatTo}:THeaderCourseProps) {
    const {progress} = useCourseContext() 
    const handleBtnNavigate =useNavigationHandler()

    const  handleComment =async()=>{
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
      handleBtnNavigate(chatTo)

    }
  return (
    <div className='header-course'>
        <button className='btn-chat-course' onClick={()=>handleComment() }><BsChatLeftTextFill style={{'background':'none'}}/></button>
        <h2 className={`title-course ${title}`}>Curso basico de {title}</h2>
        <div className="container-progress">
            <p className='progress-course-number'>{progress}</p>
            <span className="progress-bar-bg"></span>
            <span className="progress-bar-fill" style={{ width: `${progress}%` }}></span>
        </div>
        {/* Agregar sections */}    
    </div>
  )
}
