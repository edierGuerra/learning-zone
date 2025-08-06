import React, { useEffect } from 'react';
import { IoIosAdd } from "react-icons/io";
import '../styles/TeacherDashboard.css';
import { useTeacherCourseContext } from '../hooks/useCourseTeacher';
import CardCourseTeacher from './CardCourseTeacher';
import { useUser } from '../../auth/Hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '../../../shared/Utils/authStorage';

export default function TeacherDashboard() {
  const navigate = useNavigate()

  const {courses} = useTeacherCourseContext()
  const {user} = useUser()
  useEffect(() => {
  console.log("DASHBOARD: courses", courses);
}, [courses]);
  authStorage.removeCourseTeacher()


  /* Funcion del boton que permite renderizar el formulario del crear curso */
  const handleClickBtnAddCourse =()=>{
    /* Redirigir a crear curso */
    navigate('/teacher/courses/create')


  }

  return (
    <div className="container-teacher-dashboard">
      <div className="header-teacher-dashboard">
        <button className='btn-space-teacher'>Mi Espacio</button>
        <h2 className='title-welcome-teacher'>Bienvenido {user?.name}</h2>
        <button className='btn-add-course' onClick={()=>handleClickBtnAddCourse()}>{<IoIosAdd />}</button>
      </div>
      {/* Contenedor de cursos */}

      <div className='container-courses-teacher'>
        <h2 className='title-container-courses-teacher'>Mis Cursos</h2>
        {/* Componente reusable que renderiza las cards de los cursos de este profesor */}
        {courses.map((course)=>(
          <CardCourseTeacher key={course.id} id={course.id} category={course.category} description={course.description} image={course.image} name={course.name} is_published={course.is_published} palette={course.palette}/>
        ))}
      </div>
      {/* Traer componente de StudentsProgress para mostrar una tabla*/}
    </div>
  );
}
