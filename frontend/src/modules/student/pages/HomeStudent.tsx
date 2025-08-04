import { useUser } from '../../auth/Hooks/useAuth';
import { useStudentCourseContext } from '../../courses/hooks/useCourse';
import CardCourse from '../components/CardCourse';

import '../Styles/HomeStudent.css';

export default function HomeStudent() {
  const { user } =useUser();
  const { courses } = useStudentCourseContext();
  console.log('wyyyy')

  return (
    <div className="container-home-user">
      <h1 className="home-title">Bienvenid@ {user?.name}</h1>
      <p className='home-paragraph'>Selecciona un curso para comenzar</p>

      <div className="container-courses">
        {courses.map(course => {
          return (
            <CardCourse
              key={course.id}
              id ={course.id}
              name={course.name}
              description={course.description}
              image={course.image}
              category={course.category}
              palette={course.palette}
              status= {'status' in course ? course.status : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
