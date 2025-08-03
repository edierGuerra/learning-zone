import { useNavigate } from "react-router-dom";
import { useTeacherCourseContext } from "../hooks/useCourseTeacher";
import type { TCourseTeacherResponse, TLessonTeacherResponse } from "../types/Teacher";
import DeleteLessonAPI from "../services/Lesson/DeleteLesson.server";
import toast from "react-hot-toast";

type CardLessonCourseProps = {
  idLesson: TLessonTeacherResponse['id'];
  idCourse: TCourseTeacherResponse['id'];
  name: TLessonTeacherResponse['name'];
};

export default function CardLessonCourse({ idCourse, idLesson, name }: CardLessonCourseProps) {
  const { loadLesson, course } = useTeacherCourseContext();
  const navigate = useNavigate();

  const palette = course?.palette || {
    brand: '#000',
    surface: '#fff',
    text: '#000',
    accent: '#ccc',
  };

  const handleClickBtnEdit = () => {
    loadLesson(idCourse, idLesson);
    navigate(`/teacher/courses/${idCourse}/lessons/${idLesson}/edit`);
  };

  const handleClickDelete = async () => {
    await DeleteLessonAPI({ idCourse, idLesson });
    toast.success('Eliminación correcta');
    navigate(`/teacher/courses/${idCourse}`);
  };

  return (
    <div
      className="container-card-lesson"
      style={{
        backgroundColor: palette.surface,
        border: `2px solid ${palette.accent}`,
        color: palette.text,
      }}
    >
      <h2
        className="title-card-lesson"
        style={{ color: palette.brand }}
      >
        {name}
      </h2>

      <div className="container-opc-crud-lesson">
        <button
          className="btn-edit-lesson"
          onClick={handleClickBtnEdit}
        >
          ✏️ Editar
        </button>

        <button
          className="btn-delete-lesson"
          onClick={handleClickDelete}
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
}
