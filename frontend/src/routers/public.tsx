// Componente que contiene solo las rutas publicas

import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "../shared/Layouts/PublicLayout";
import LandingPage from "../pages/LandingPage";
import LoginAndRegister from "../modules/auth/pages/LoginAndRegister";
import { SitePolicies } from "../pages/info/SitePolicies";
import ConfirmEmail from "../modules/auth/pages/ConfirmEmail";
import InstitutionPage from "../pages/about/Institution";
import { AboutUs } from "../pages/about/TeamInfo";
import AuthLayout from "../shared/Layouts/AuthLayout";
import Home from "../modules/dashboard/pages/Home";
import PrivateRouters from "./PrivateRouters";


export default function RoutersPublic() {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<PublicLayout />} errorElement={<h1>OOOOOO</h1>}>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/register" element={<LoginAndRegister opcAuth={false} />}/>
                <Route path="/confirmEmail" element={<ConfirmEmail/>}/>
                <Route path="/login" element={<LoginAndRegister opcAuth ={true}/>}/>
                <Route path="/aboutInstitution" element={<InstitutionPage/>}/>
                <Route path="/aboutUs" element={<AboutUs/>}/>
                <Route path="/sitePolicies" element={<SitePolicies/>}/>

              <Route element={<PrivateRouters/>}>
                <Route element={<AuthLayout/>}>
                  <Route path="/home" element={<Home/>}/>
                </Route>
              </Route>

            </Route>
        </Routes>
    
    </BrowserRouter>
      
  )
}
