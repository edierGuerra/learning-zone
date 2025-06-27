// Componente que agrupa las rutas privadas

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "../shared/Layouts/AuthLayout";
import Home from "../modules/dashboard/pages/Home";
import UserPage from "../modules/user/userPage";
import WordHomePage from "../modules/courses/word/pages/WordHomePage";
import ExcelHomePage from "../modules/courses/excel/pages/ExcelHomePage";
import PowerPointHomePage from "../modules/courses/powerpoint/pages/PowerPointHomePage";


export default function RoutersPrivates() {
  return (
    <BrowserRouter>
        <Routes>
              <Route element={<AuthLayout/>}>
                  <Route path="/home" element={<Home/>}/>
                  <Route path="/userPage" element={<UserPage/>}/>
                  <Route path="/word" element={<WordHomePage/>}/>
                  <Route path="/excel" element={<ExcelHomePage/>}/>
                  <Route path="/powerPoint" element={<PowerPointHomePage/>}/>
              </Route>
        </Routes>
    
    </BrowserRouter>
      
  )
}
