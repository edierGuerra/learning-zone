import { Routes, Route } from "react-router-dom";
import AuthLayout from "../shared/Layouts/AuthLayout";
import PrivateRouters from "./PrivateRouters";
import { sharedRoutes } from "./SharedRouters";
import TeacherRoutes from "./TeacherRoutes";
import StudentRoutes from "./StudentRoutes";
import RoleRedirect from "./RoleRedirect";

export default function RoutersPrivates() {
  return (
    <Routes>
      {/* Todas las rutas privadas requieren autenticación */}
      <Route element={<PrivateRouters />}>
        <Route element={<AuthLayout />}>
          {/* Redirige según el rol del usuario (después del login) */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Rutas para cada rol */}
          <Route path="/teacher/*" element={<TeacherRoutes />} />
          <Route path="/student/*" element={<StudentRoutes />} />

          {/* Rutas comunes pero protegidas (quiénes somos, políticas, etc.) */}
          {sharedRoutes}
        </Route>
      </Route>
    </Routes>
  );
}


