import { Route, Routes } from "react-router-dom";
import ContentPage from "../modules/courses/components/ContentPage";
import EvaluationPage from "../modules/courses/components/EvaluationPage";
import CommentPageWrapper from "../modules/courses/comments/CommentPageWrapper";
import HomeStudent from "../modules/student/pages/HomeStudent";
import StudentProfile from "../modules/student/pages/StudentProfile";
import CourseHomePage from "../modules/courses/pages/HomeCourse";


export default function StudentRouters() {
  return (
    <Routes>
      {/* rutas del estudiante */}
        <Route path="/homeStudent" element={<HomeStudent />} />
        <Route path="/profileStudent" element={<StudentProfile/>}/> {/* Perfil del estudiante */}
        <Route path="/course/:id/:nameCourse" element={<CourseHomePage />} />
        <Route path="/contentPage" element={<ContentPage/>}/>
        <Route path="/evaluationPage" element={<EvaluationPage/>}/>
        <Route path="/comments/:courseId" element={<CommentPageWrapper />} />

    </Routes>
  );
}