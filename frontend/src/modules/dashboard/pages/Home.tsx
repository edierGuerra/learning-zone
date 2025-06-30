import { useUser } from '../../auth/Hooks/useAuth'
import '../Styles/Home.css'
export default function Home() {
  const {student} = useUser()
  return (
    <div className="container-home-user">
      <h1 className='home-title'>Bienvenido {student?.name} </h1>
      <p>Selecciona un curso para comenzar</p>
      <div className="container-courses">
        CURSOS
      </div>

    </div>
  )
}
