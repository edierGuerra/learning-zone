// Componente que contiene solo las rutas publicas

import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "../shared/Layouts/PublicLayout";
import LandingPage from "../pages/LandingPage";
import LoginAndRegister from "../modules/auth/pages/LoginAndRegister";
import InstitutionPage from "../pages/about/Institution";
import { AboutUs } from "../pages/about/TeamInfo";

export default function RoutersPublic() {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<PublicLayout/>} errorElement={<h1>OOOOOO</h1>}>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={<LoginAndRegister/>}/>
                <Route path="/register" element={<LoginAndRegister/>}/>
                <Route path="/aboutInstitution" element={<InstitutionPage/>}/>
                <Route path="/aboutUs" element={<AboutUs/>}/>
                
            </Route>
        </Routes>
    
    </BrowserRouter>
      
  )
}
