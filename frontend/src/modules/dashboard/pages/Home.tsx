import { useUser } from '../../auth/Hooks/useAuth'
import CardCourse from '../Components/CardCourse'
import word from '../../../assets/learningZone/img-word-course.png'
import powerpoint from '../../../assets/learningZone/img-powerpoint-course.png'
import excel from '../../../assets/learningZone/img-excel-course.png'

import '../Styles/Home.css'
export default function Home() {
  const {student} = useUser()
  return (
    <div className="container-home-user">
      <h1 className='home-title'>Bienvenido {student?.name} </h1>
      <p>Selecciona un curso para comenzar</p>
      <div className="container-courses">
        <CardCourse name='excel' description='Curso basico de Excel para 
        manipular datos' image={excel}/>

        <CardCourse name='word' description='Curso basico de Word para
        crear documentos' image={word}/>

        <CardCourse name='powerpoint' description='Curso basico de Power Point 
        para crear presentaciones.' image={powerpoint}/>
       
      </div>

    </div>
  )
}
