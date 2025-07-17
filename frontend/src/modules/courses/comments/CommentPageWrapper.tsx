// src/pages/CommentPageWrapper.tsx
import { useParams } from 'react-router-dom';
import CommentPage from './CommentPage';

export default function CommentPageWrapper() {
  const { courseId } = useParams();

  // Si tu URL es tipo /comentarios/1, asegúrate de convertir a número
  const numericCourseId = Number(courseId);



  return (
    <CommentPage
      courseId={numericCourseId}
    />
  );
}
