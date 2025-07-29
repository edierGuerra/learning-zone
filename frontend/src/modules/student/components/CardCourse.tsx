import { useCourseContext } from '../../courses/hooks/useCourse';
import { RiProgress8Line } from "react-icons/ri";
import { GrStatusGood } from "react-icons/gr"; 
import '../Styles/CardCourse.css'
import type { TCourse } from '../../courses/types/Course';
import { useNavigate } from 'react-router-dom';

type CardCourseProps ={
  id:number,
  image: string,
  name:string,
  description: string,
  status:TCourse['status'] 

}

export default function CardCourse({id,image, name, description, status }:CardCourseProps) {
  const {loadLessonsCourse} = useCourseContext()
    const navigate = useNavigate();

  const handleClickCourse =()=>{
    loadLessonsCourse(id) /* Ejecutar funcion del hook que trae las lecciones */
    navigate(`/comments/${name}`);

  }
  return (
    <div onClick={()=> handleClickCourse()}  className='container-card-course' style={{'backgroundColor':'#101'}}>
        <img className='image-course-card' src={image} alt="Img-course" />
        <h3 className='title-course-card'>{name.toLocaleUpperCase()}</h3>
        <p className='description-course-card'>{description}</p>
        <p className='icon-progress-course'>{ status  ==="completed"? <GrStatusGood color='#FFB5B5'/>:<RiProgress8Line color='#FF7052'/>} </p>
    
    </div>
  )
}
