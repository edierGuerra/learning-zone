// Componente que agrupa las rutas privadas

import { Routes, Route } from "react-router-dom";
import AuthLayout from "../shared/Layouts/AuthLayout";

import Help from "../pages/Help";
import PrivateRouters from "./PrivateRouters";
import { sharedRoutes } from "./SharedRouters";
import CourseRouter from "./CourseRouter";
import LandingPage from "../pages/LandingPage";
import CommentPageWrapper from "../modules/courses/comments/CommentPageWrapper";
import ContentPage from "../modules/courses/components/ContentPage";
import EvaluationPage from "../modules/courses/components/EvaluationPage";
import StudentPage from "../modules/student/pages/StudentPage";


export default function RoutersPrivates() {
  return (
        <Routes>
          <Route element={<PrivateRouters/>}>
              <Route element={<AuthLayout/>}>
                  <Route path="/home" element={<StudentPage/>}/>
                  <Route path="/help" element={<Help/>}/>
                  {/* Rutas de los cursos */}
                  <Route path="/courses/:courseSlug" element={<CourseRouter />} />
                  <Route path="/contentPage" element={<ContentPage/>}/>
                  <Route path="/evaluationPage" element={<EvaluationPage/>}/>
                  
                  <Route path="/comments/:courseId" element={<CommentPageWrapper />} />
                  {/*Redirigir / a /home si está logueado */}
                  <Route path="/" element={ <LandingPage/>} />,
                  {sharedRoutes}

              </Route>
            </Route>
        </Routes>
    
      
  )
}
