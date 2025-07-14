import { useNavigationHandler } from '../../../hooks/useNavigationHandler';
import { useCourseContext } from '../../courses/hooks/useCourse';
import '../Styles/CardCourse.css'
type CardCourseProps ={
  id:number,
  image: string,
  name:string,
  description: string,

}

export default function CardCourse({id,image, name, description}:CardCourseProps) {
  const {loadLessonsCourse} = useCourseContext()

  
  
  
  const handleBtnNavigate = useNavigationHandler()
  const backgroundColor =
  name.toLowerCase() === 'excel'
  ? 'var(--color-main-excel)'
  : name.toLowerCase() === 'powerpoint'
  ? 'var(--color-main-powerPoint)'
  : 'var(--color-main-word)';
  
  const routeCourse =
  name.toLowerCase() === 'excel'
  ? '/excel'
  : name.toLowerCase() === 'word'
  ? '/word'
  : '/powerpoint'

  const handleClickCourse =()=>{
    loadLessonsCourse(id) /* Ejecutar funcion del hook que trae las lecciones */
    handleBtnNavigate(routeCourse)/* Redirijir al home del curso */
  }
  return (
    <div onClick={()=> handleClickCourse()}  className='container-card-course' style={{'backgroundColor':backgroundColor}}>
        <img className='image-course-card' src={image} alt="Img-course" />
        <h3 className='title-course-card'>{name.toLocaleUpperCase()}</h3>
        <p className='description-course-card'>{description}</p>
    </div>
  )
}
