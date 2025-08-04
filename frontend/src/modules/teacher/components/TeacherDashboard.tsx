import React from 'react';
import '../styles/TeacherDashboard.css';
import { useTeacherCourseContext } from '../hooks/useCourseTeacher';
import CardCourseTeacher from './CardCourseTeacher';
import { useUser } from '../../auth/Hooks/useAuth';

export default function TeacherDashboard() {
  const {courses} = useTeacherCourseContext()
  const {user} = useUser()

  return (
    <div className="container-teacher-dashboard">
      <h2 className='title-welcome-teacher'>Bienvenido {user?.name}</h2>
      <button className='btn-space-teacher'>Mi Espacio</button>
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
