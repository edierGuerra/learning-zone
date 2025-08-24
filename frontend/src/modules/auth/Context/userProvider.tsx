/* agregar consulta al backend del rol y retornarlo */
import React, { useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { authStorage } from "../../../shared/Utils/authStorage";
import type { TUser, TUserRole } from "../../types/User";
import { useNavigationHandler } from "../../../hooks/useNavigationHandler";
import { GetStudentAPI } from "../Services/GetInformationStudent.server";
import toast from "react-hot-toast";
import { GetRoleUserAPI } from "../Services/GetRoleUser.server";
import { GetTeacherAPI } from "../Services/GetInformationTeacher.server";
import type { TNotificationsStudent } from "../../notifications/types/Notifications";

// Props que recibe el Provider
type Props = {
  children: React.ReactNode;
};

// Provider principal que controla la sesión de cualquier usuario (estudiante o maestro)
export const UserProvider = ({ children }: Props) => {
  const handleBtnNavigate = useNavigationHandler();

  // Estado para el usuario actual (estudiante o maestro)
  const [user, setUser] = useState<TUser | null>(null);
  const [role, setRole] = useState<TUserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<TNotificationsStudent>([]);
  const [isReady, setIsReady] = useState(false);

  /**
   * initSession
   * -----------
   * Sincroniza el estado global del usuario después del login exitoso.
   * Lee el token desde localStorage, obtiene el rol desde el backend,
   * y carga la información correspondiente del usuario y sus notificaciones.
   * Esta función debe llamarse inmediatamente después de guardar el token.
   */
const initSession = async (): Promise<boolean> => {
  const storedToken = authStorage.getToken();
  if (!storedToken) {
    console.log('❌ initSession - No hay token');
    return false;
  }

  try {
    console.log('🔄 initSession - Obteniendo rol del usuario...');
    const roleUser = await GetRoleUserAPI();
    authStorage.setRole(roleUser);
    setRole(roleUser);
    setToken(storedToken);
    console.log('✅ initSession - Role detectado:', roleUser);

    if (roleUser === "student") {
      console.log('🔄 initSession - Obteniendo datos del estudiante...');
      const data = await GetStudentAPI();
      const userData: TUser = {
        id: data.id,
        numIdentification: data.identification_number,
        name: data.names,
        lastNames: data.last_names,
        email: data.email,
        prefixProfile: data.prefix_profile
      };
      authStorage.setUser(userData);
      setUser(userData);
      console.log('✅ initSession - Datos del estudiante cargados:', userData);
    } else if(roleUser === 'teacher') {
      console.log('🔄 initSession - Obteniendo datos del profesor...');
      const data = await GetTeacherAPI();
      const userData: TUser = {
        id: data.id,
        name: data.names,
        email: data.email,
        prefixProfile: data.prefix_profile
      };
      authStorage.setUser(userData);
      setUser(userData);
      console.log('✅ initSession - Datos del profesor cargados:', userData);
    }

/*     const userNotifications = await GetNotificationsAPI();
    authStorage.setNotifications(userNotifications);
    setNotifications(userNotifications);
 */
    console.log('✅ initSession - Sesión inicializada completamente');
    return true;

  } catch (error) {
    console.error("❌ initSession - Error al inicializar sesión:", error);
    return false;
  }
};

  // Carga inicial: verifica si hay sesión guardada o incompleta
  useEffect(() => {
    const storedToken = authStorage.getToken();
    const storedUser = authStorage.getUser();
    const storedNotifications = authStorage.getNotificationsStudent();
    const storedRole = authStorage.getRole();

    console.log('🔄 UserProvider - Carga inicial:', {
      hasToken: !!storedToken,
      hasUser: !!storedUser,
      hasNotifications: !!storedNotifications,
      hasRole: !!storedRole,
      role: storedRole,
      user: storedUser
    });

    // NUEVO: Si hay token y rol pero NO usuario, ejecutar initSession
    if (storedToken && storedRole && !storedUser) {
      console.log('🔄 UserProvider - Token y rol presentes, pero NO usuario. Ejecutando initSession...');
      initSession().then((success) => {
        if (success) {
          console.log('✅ UserProvider - initSession completado exitosamente');
        } else {
          console.log('❌ UserProvider - initSession falló');
        }
      });
    }

    // Si ya todo está guardado, restaurar directamente al contexto
    if (storedUser && storedToken && storedRole) {
      console.log('✅ UserProvider - Restaurando sesión desde localStorage');
      setUser(storedUser);
      setToken(storedToken);
      setNotifications(storedNotifications || []);
      setRole(storedRole);
    }

    setIsReady(true);
  }, []);

  // Verifica si el usuario está logueado
  const isLoggedIn = !!user && !!role;

  // Cierra sesión y limpia todo
  const logout = () => {
    authStorage.removeToken();
    authStorage.removeUser();
    authStorage.removeNotificationsStudent();
    authStorage.removeCoursesStudent();

    setUser(null);
    setRole(null);
    setToken(null);
    setNotifications([]);
    authStorage.removeRole()

    toast.success("Sesión cerrada");
    handleBtnNavigate("/");
  };

  const numberNotifications = notifications.length;

  return (
    <UserContext.Provider
      value={{
        user,
        role,
        token,
        logout,
        isLoggedIn,
        isReady,
        setUser,
        setToken,
        setRole,
        setNotifications,
        notifications,
        numberNotifications,
        initSession // Se expone al contexto para uso posterior
      }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};
