import { Route, Routes } from "react-router-dom";
import CourseRouter from "./CourseRouter";
import ContentPage from "../modules/courses/components/ContentPage";
import EvaluationPage from "../modules/courses/components/EvaluationPage";
import CommentPageWrapper from "../modules/courses/comments/CommentPageWrapper";
import HomeStudent from "../modules/student/pages/HomeStudent";
import StudentPage from "../modules/student/pages/StudentPage";

export default function StudentRouters() {
  return (
    <Routes>
      {/* rutas del estudiante */}
        <Route path="/homeStudent" element={<HomeStudent />} />
        <Route path="/profileStudent" element={<StudentPage/>}/> {/* Perfil del estudiante */}
        <Route path="/courses/:nameCourse" element={<CourseRouter />} />
        <Route path="/contentPage" element={<ContentPage/>}/>
        <Route path="/evaluationPage" element={<EvaluationPage/>}/>
        <Route path="/comments/:courseId" element={<CommentPageWrapper />} />

    </Routes>
  );
}