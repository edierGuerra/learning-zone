import CardLessonCourse from '../components/CardLessonCourse';
import type { TLessonTeacherResponse } from '../types/Teacher';
import { useNavigate, useParams } from 'react-router-dom';
import { useTeacherCourseContext } from '../hooks/useCourseTeacher';
import { authStorage } from '../../../shared/Utils/authStorage';
import { useEffect } from 'react';
import UpdateIsPublishedAPI from '../services/Course/UpdateIsPublished.server';
import DeleteCourseAPI from '../services/Course/DeleteCourse.serve';
import toast from 'react-hot-toast';
import GetCourseTeacherAPI from '../services/Course/GetCourseTeacher.server';

export default function CourseManagement() {
  const { lessons, loadInfoCourse, course } = useTeacherCourseContext();
  const { courseId } = useParams<{ courseId: string }>();
  const idCourse = Number(courseId);
  const navigate = useNavigate();

  useEffect(() => {
    loadInfoCourse(idCourse);
  }, [idCourse, loadInfoCourse]);

  const handleClickAggLesson = () => {
    authStorage.removeFormLessonInfo();
    navigate(`/teacher/courses/${idCourse}/lessons/create`);
  };

  const handleClickPublished = async () => {
    const isPublished = !course?.is_published;
    const response = await UpdateIsPublishedAPI(idCourse, isPublished);
    if (response === 200) {
      navigate(`/teacher/courses/${idCourse}`);
    }
  };

  const handleClickEditCourse = async () => {
    const response = await GetCourseTeacherAPI(idCourse);
    authStorage.setCourseTeacher(response);
    navigate(`/teacher/courses/${idCourse}/edit`);
  };

  const handleClickDeleteCourse = async () => {
    const response = await DeleteCourseAPI(idCourse);
    toast.success(response.message || 'Curso eliminado correctamente');
    navigate(`/teacher/courses`);
  };

  const palette = course?.palette || {
    brand: '#000',
    surface: '#fff',
    text: '#000',
    accent: '#ccc',
  };

  return (
    <div
      className='container-management-course-teacher'
      style={{
        backgroundColor: palette.surface,
        color: palette.text,
        border: `2px solid ${palette.accent}`,
        padding: '1rem',
        borderRadius: '10px',
      }}
    >
      <header className="header-crud-course-teacher">
        <div className='container-info-course'>
          <img
            className="image-course-hedader-teacher"
            src={course?.image}
            alt={`Imagen del curso ${course?.name}`}
            style={{ borderBottom: `3px solid ${palette.accent}` }}
          />
          <span className='category-management-course' style={{ color: palette.accent }}>
            {course?.category}
          </span>
          <h2 className='title-course' style={{ color: palette.brand }}>
            {course?.name}
          </h2>
          <p className='description-course'>{course?.description}</p>
        </div>

        <div className="crud-actions">
          <button
            type="button"
            title="Eliminar curso"
            onClick={handleClickDeleteCourse}
            style={{ borderColor: palette.accent, color: 'red' }}
          >
            🗑 Eliminar
          </button>

          <button
            type="button"
            title="Actualizar curso"
            onClick={handleClickEditCourse}
            style={{ borderColor: palette.accent, color: palette.text }}
          >
            ✏️ Editar
          </button>

          {lessons.length >= 5 && (
            <button
              type="button"
              title="Publicar o despublicar"
              onClick={handleClickPublished}
              style={{
                backgroundColor: course?.is_published ? '#F87171' : '#34D399', // rojo o verde
                color: '#fff',
                fontWeight: 'bold',
                border: `1px solid ${course?.is_published ? '#DC2626' : '#059669'}`,
                borderRadius: '6px',
                padding: '0.5rem 1rem',
              }}
            >
              {course?.is_published ? 'Quitar' : 'Publicado'}
            </button>
          )}
        </div>
      </header>

      <button
        onClick={handleClickAggLesson}
        style={{
          backgroundColor: palette.brand,
          color: '#fff',
          padding: '0.5rem 1rem',
          border: `1px solid ${palette.accent}`,
          borderRadius: '5px',
          marginTop: '1rem',
        }}
      >
        ➕ Agregar lección
      </button>

      <div className="lesson-cards-teacher">
        {lessons.map((lesson: TLessonTeacherResponse) => (
          <CardLessonCourse
            key={lesson.id}
            idCourse={idCourse}
            idLesson={lesson.id}
            name={lesson.name}
          />
        ))}
      </div>
    </div>
  );
}
