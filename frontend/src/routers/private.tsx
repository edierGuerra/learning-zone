// Componente que agrupa las rutas privadas

import { Routes, Route } from "react-router-dom";
import AuthLayout from "../shared/Layouts/AuthLayout";
import Home from "../modules/dashboard/pages/Home";

import Help from "../pages/Help";
import UserPage from "../modules/user/UserPage";
import PrivateRouters from "./PrivateRouters";
import { sharedRoutes } from "./SharedRouters";
import WordHomePage from "../modules/courses/word/WordHomePage";
import ExcelHomePage from "../modules/courses/excel/ExcelHomePage";
import PowerPointHomePage from "../modules/courses/powerpoint/PowerPointHomePage";
import LandingPage from "../pages/LandingPage";
import CommentPageWrapper from "../modules/courses/comments/CommentPageWrapper";
import ContentPage from "../modules/courses/components/ContentPage";
import EvaluationPage from "../modules/courses/components/EvaluationPage";


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
