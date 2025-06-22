// Componente que agrupa las rutas privadas

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "../shared/Layouts/AuthLayout";
import Home from "../modules/dashboard/pages/Home";


export default function RoutersPrivates() {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<AuthLayout/>}>
                <Route path="/home" element={<Home/>}/>
            </Route>
        </Routes>
    
    </BrowserRouter>
      
  )
}
