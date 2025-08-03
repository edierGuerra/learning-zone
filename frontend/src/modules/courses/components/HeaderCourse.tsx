import '../styles/HeaderCourse.css';
import { BsChatLeftTextFill } from "react-icons/bs";

import GetAllStudentsCommentsAPI from '../services/GetAllStudentsComments.server';
import { authStorage } from '../../../shared/Utils/authStorage';
import type { TStudentAllComents } from '../comments/types';
import { useNavigate } from 'react-router-dom';
import { useStudentCourseContext } from '../hooks/useCourse';
import type { TCourse } from '../types/CourseStudent';

// Props del componente: recibe título dinámico
interface THeaderCourseProps {
  title: string;
  idCourse:TCourse['id']
}

export default function HeaderCourse({ title, idCourse }: THeaderCourseProps) {
  const { progress } = useStudentCourseContext();
  const navigate = useNavigate();

  const handleComment = async () => {
    // Cargar estudiantes para comentarios
    const students = await GetAllStudentsCommentsAPI();
    const studentStorage: TStudentAllComents[] = students.map(student => ({
      id: student.id,
      numIdentification: student.num_identification,
      name: student.name,
      lastNames: student.last_names,
      email: student.email,
      prefixProfile: student.prefix_profile,
      stateConnect: false,
    }));
    authStorage.setAllStudents(studentStorage);
    const courseId = idCourse;
    if (courseId) {
      navigate(`/comments/${courseId}`);
    } else {
      alert('No se encontró el curso correspondiente.');
    }
  };

  return (
    <div className="header-course">
      <button className="btn-chat-course" onClick={handleComment}>
        <BsChatLeftTextFill style={{ background: 'none' }} />
      </button>
      <h2 className={`title-course ${title}`}>Curso básico de {title}</h2>
      <div className="container-progress">
        <p className="progress-course-number">{progress}</p>
        <span className="progress-bar-bg"></span>
        <span className={`progress-bar-fill-${title}`} style={{ width: `${progress}%` }}></span>
      </div>
    </div>
  );
}
