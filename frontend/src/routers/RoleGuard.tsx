/*
 * Protege las rutas según el rol del usuario.
 * Solo permite acceso a usuarios con roles específicos.
 */

import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../modules/auth/Hooks/useAuth";
// TIPOS
interface RoleGuardProps {
  allowedRoles: string[];
  redirectTo?: string;
}

// COMPONENTE PRINCIPAL

/**
 * RoleGuard - Componente principal de protección por roles
 *
 * @param allowedRoles - Roles que pueden acceder a esta ruta
 * @param redirectTo - Ruta de redirección si no tiene permisos
 */
export default function RoleGuard({
  allowedRoles,
  redirectTo = "/"
}: RoleGuardProps) {
  const { user, role } = useUser();

  // Verificar si el usuario está autenticado
  if (!user || !role) {
    return <Navigate to={redirectTo} replace />;
  }

  // Verificar si el rol está permitido
  if (!allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Acceso permitido
  return <Outlet />;
}

// GUARDS ESPECÍFICOS(guard es un mecanismo de protección que controla el acceso a rutas o componentes.)

/**
 * TeacherGuard - Solo permite acceso a maestros
 */
export function TeacherGuard() {
  return <RoleGuard allowedRoles={["teacher"]} redirectTo="/" />;
}

/**
 * StudentGuard - Solo permite acceso a estudiantes
 */
export function StudentGuard() {
  return <RoleGuard allowedRoles={["student"]} redirectTo="/" />;
}
