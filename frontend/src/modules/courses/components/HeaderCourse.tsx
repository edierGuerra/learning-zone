/* Encabezado del curso */
import '../styles/HeaderCourse.css'
import { BsChatLeftTextFill } from "react-icons/bs";
import { useNavigationHandler } from "../../../hooks/useNavigationHandler";
import { useCourseContext } from '../hooks/useCourse';
/* Componnete reutilizable que muestra el header del curso */
type THeaderCourseProps ={
    title:'Excel' | 'Word' | 'Power-Point ';
    chatTo: '/chatWord' | '/chatExcel' | '/chatPowerPoint';
}
export default function HeaderCourse({title,chatTo}:THeaderCourseProps) {
    const {progress} = useCourseContext() 
    const handleBtnNavigate =useNavigationHandler()
  return (
    <div className='header-course'>
        <button className='btn-chat-course' onClick={()=> handleBtnNavigate(chatTo)}><BsChatLeftTextFill style={{'background':'none'}}/></button>
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
