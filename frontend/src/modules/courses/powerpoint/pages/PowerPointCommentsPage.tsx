import { authStorage } from "../../../../shared/Utils/authStorage"
import CommentPage from "../../comments/CommentPage"
import './styles/PowerPointCommentsPage.css';

export default function PowerPointCommentsPage() {
  const cursos = authStorage.getCourses()
  const curso = cursos.find(curso => curso.name.toLowerCase() === 'powerpoint')
  return (
    <CommentPage
      courseId={curso!.id}
      nameCourse={curso!.name}
    />
  )
}
