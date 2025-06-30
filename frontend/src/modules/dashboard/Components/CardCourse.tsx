import { useNavigationHandler } from '../../../hooks/useNavigationHandler';
import '../Styles/CardCourse.css'
type CardCourseProps ={
    image: string,
    name:string,
    description: string,

}

export default function CardCourse({image, name, description}:CardCourseProps) {
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
    : '/powerPoint'
  return (
    <div onClick={()=> handleBtnNavigate(routeCourse)}  className='container-card-course' style={{'backgroundColor':backgroundColor}}>
        <img className='image-course-card' src={image} alt="Img-course" />
        <h3 className='title-course-card'>{name.toLocaleUpperCase()}</h3>
        <p className='description-course-card'>{description}</p>
    </div>
  )
}
