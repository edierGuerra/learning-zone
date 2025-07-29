import { useUser } from '../../auth/Hooks/useAuth';
import CardCourse from '../components/CardCourse';
import word from '../../../assets/learningZone/img-word-course.png';
import powerpoint from '../../../assets/learningZone/img-powerpoint-course.png';
import excel from '../../../assets/learningZone/img-excel-course.png';

import '../Styles/HomeStudent.css';
import { useCourseContext } from '../../courses/hooks/useCourse';

export default function HomeStudent() {
  const { user } =useUser();
  const { courses } = useCourseContext();

  // Relación entre nombre y su imagen correspondiente
  const courseImages: Record<string, string> = {/* Record crea un objeto con claves del tipo K y valores del tipo T. */
    excel,
    word,
    'powerpoint': powerpoint,
  };

  return (
    <div className="container-home-user">
      <h1 className="home-title">Bienvenid@ {user?.name}</h1>
      <p className='home-paragraph'>Selecciona un curso para comenzar</p>

      <div className="container-courses">
        {courses.map(course => {
          const nameKey = course.name.toLowerCase();
          const image = courseImages[nameKey]; /* Traer la imagen correspondiente a el nombre que venga del backend */

          if (!image) return null; // Si no hay imagen asignada, no renderiza nada

          return (
            <CardCourse
              key={course.id}
              id ={course.id}
              name={course.name}
              description={course.description}
              image={image}
              status= {course.status} 
            />
          );
        })}
      </div>
    </div>
  );
}
