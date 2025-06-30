// Componente que contiene solo las rutas publicas

import { Routes, Route } from "react-router-dom";
import PublicLayout from "../shared/Layouts/PublicLayout";
import LandingPage from "../pages/LandingPage";
import LoginAndRegister from "../modules/auth/pages/LoginAndRegister";
import ConfirmEmail from "../modules/auth/pages/ConfirmEmail";
import { sharedRoutes} from "./SharedRouters";


export default function RoutersPublic() {
  return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/register" element={<LoginAndRegister opcAuth={false} />}/>
                <Route path="/confirmEmail" element={<ConfirmEmail/>}/>
                <Route path="/login" element={<LoginAndRegister opcAuth ={true}/>}/>
                {sharedRoutes}
                
            </Route>
        </Routes>
  )
}
