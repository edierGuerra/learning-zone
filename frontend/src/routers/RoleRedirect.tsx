import { Navigate } from "react-router-dom";
import { useUser } from "../modules/auth/Hooks/useAuth";

/**
 * Redirige automáticamente según el rol del usuario.
 * No renderiza contenido visible.
 */
export default function RoleRedirect() {
  const { user, role, isReady } = useUser();

  // Esperar a que la información del usuario esté lista
  if (!isReady) return null;

  // Usuario no autenticado
  if (!user || !role) {
    return <Navigate to="/" replace />;
  }

  // Redirección según rol
  if (role === "teacher") {
    return <Navigate to="/teacher/home-teacher" replace />;
  }

  if (role === "student") {
    return <Navigate to="/student/home-student" replace />;
  }

  // Rol desconocido
  return <Navigate to="/" replace />;
}
