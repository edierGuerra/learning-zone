import { Routes, Route } from "react-router-dom";
import AuthLayout from "../shared/Layouts/AuthLayout";
import PrivateRouters from "./PrivateRouters";
import { sharedRoutes } from "./SharedRouters";
import TeacherRoutes from "./TeacherRoutes";
import StudentRoutes from "./StudentRoutes";
import RoleRedirect from "./RoleRedirect";
import { StudentGuard, TeacherGuard } from "./RoleGuard";

export default function RoutersPrivates() {
  return (
    <Routes>
      {/* Todo lo privado está protegido por este wrapper */}
      <Route element={<PrivateRouters />}>
        <Route element={<AuthLayout />}>

          {/* Redirección automática según el rol */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Rutas protegidas para profesores */}
          <Route element={<TeacherGuard />}>
            <Route path="/teacher/*" element={<TeacherRoutes />} />
          </Route>

          {/* Rutas protegidas para estudiantes */}
          <Route element={<StudentGuard />}>
            <Route path="/student/*" element={<StudentRoutes />} />
          </Route>

          {/* Rutas compartidas protegidas */}
          {sharedRoutes}

        </Route>
      </Route>
    </Routes>
  );
}
