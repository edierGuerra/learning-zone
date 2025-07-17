import { authStorage } from "../../../../shared/Utils/authStorage"
import CommentPage from "../../comments/CommentPage"
import './styles/ExcelCommentsPage.css';

export default function ExcelCommentsPage() {
  const cursos = authStorage.getCourses()
  const curso = cursos.find(curso => curso.name.toLowerCase() === 'excel')
  return (
    <CommentPage
      courseId={curso!.id}
      nameCourse={curso!.name}
    />
  )
}
