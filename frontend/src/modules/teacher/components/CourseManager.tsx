import { FaEdit, FaTrashAlt } from "react-icons/fa";
import '../Styles/CardCourse.css'; // Reutilizamos estilos
import type { TLessonTeacherResponse } from "../types/Teacher";

type CardLessonCourseProps = {
  id: TLessonTeacherResponse['id'];
  name: TLessonTeacherResponse['name'];
  palette: {
    brand: string;
    surface: string;
    text: string;
    accent: string;
  };
};

export default function CardLessonCourse({ id, name, palette }: CardLessonCourseProps) {

  const handleDeleteLesson =()=>{

  }
  return (
    <div
      className="container-card-course"
      style={{
        backgroundColor: palette.surface,
        color: palette.text,
        border: `2px solid ${palette.accent}`,
      }}
    >
      {/* Título de la lección */}
      <h3 className="title-course-card" style={{ color: palette.brand }}>
        {name.toUpperCase()}
      </h3>

      {/* Botones de acciones CRUD */}
      <div className="container-opc-crud-lesson">
        <button
          className="btn-edit-lesson"
          style={{ color: palette.accent }}
          onClick={() => handleDeleteLesson()}
        >
          <FaEdit /> Editar
        </button>

        <button
          className="btn-delete-lesson"
          style={{ color: palette.text }}
          onClick={() => onDelete(id)}
        >
          <FaTrashAlt /> Eliminar
        </button>
      </div>
    </div>
  );
}
