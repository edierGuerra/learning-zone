// Componente que agrupa las rutas privadas

import { Routes, Route } from "react-router-dom";
import AuthLayout from "../shared/Layouts/AuthLayout";
import Home from "../modules/dashboard/pages/Home";

import Help from "../pages/Help";
import UserPage from "../modules/user/UserPage";
import PrivateRouters from "./PrivateRouters";
import { sharedRoutes } from "./SharedRouters";
import WordHomePage from "../modules/courses/word/pages/WordHomePage";
import ExcelHomePage from "../modules/courses/excel/pages/ExcelHomePage";
import PowerPointHomePage from "../modules/courses/powerpoint/pages/PowerPointHomePage";
import LandingPage from "../pages/LandingPage";


export default function RoutersPrivates() {
  return (
        <Routes>
          <Route element={<PrivateRouters/>}>
              <Route element={<AuthLayout/>}>
                  <Route path="/home" element={<Home/>}/>
                  <Route path="/userPage" element={<UserPage/>}/>
                  <Route path="/help" element={<Help/>}/>
                  {/* Rutas de los cursos */}
                  <Route path="/word" element={<WordHomePage/>}/>
                  <Route path="/excel" element={<ExcelHomePage/>}/>
                  <Route path="/powerPoint" element={<PowerPointHomePage/>}/>
{/*                   <Route path="/course/:courseId/lesson/:lessonId/content" element={<LessonContentPage />} />
                  <Route path="/course/:courseId/lesson/:lessonId/evaluation" element={<LessonEvaluationPage />} /> */}
                  {sharedRoutes}
                  {/*Redirigir / a /home si está logueado */}
                  <Route path="/" element={ <LandingPage/>} />

              </Route>
            </Route>
        </Routes>
    
      
  )
}
