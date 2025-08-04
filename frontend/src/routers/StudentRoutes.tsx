// ✅ StudentRoutes.tsx corregido
import { Routes, Route } from "react-router-dom";
import ContentPage from "../modules/courses/components/ContentPage";
import EvaluationPage from "../modules/courses/components/EvaluationPage";
import CommentPageWrapper from "../modules/courses/comments/CommentPageWrapper";
import HomeStudent from "../modules/student/pages/HomeStudent";
import StudentProfile from "../modules/student/pages/StudentProfile";
import CourseHomePage from "../modules/courses/pages/HomeCourse";

export default function StudentRoutes() {
  return (
    <Routes>
      {/* rutas del estudiante */}
      <Route path="home-student" element={<HomeStudent />} />
      <Route path="profile-student" element={<StudentProfile />} />
      <Route path="course/:id/:nameCourse" element={<CourseHomePage />} />
      <Route path="contents-page" element={<ContentPage />} />
      <Route path="evaluation-page" element={<EvaluationPage />} />
      <Route path="comments/:courseId" element={<CommentPageWrapper />} />
    </Routes>
  );
}
