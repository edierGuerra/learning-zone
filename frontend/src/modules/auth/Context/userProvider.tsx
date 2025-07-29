import React, { useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { authStorage } from "../../../shared/Utils/authStorage";
import type { TUser, UserRole } from "../../types/User";
import { useNavigationHandler } from "../../../hooks/useNavigationHandler";
import { GetStudentAPI } from "../Services/GetInformationStudent.server";
import GetNotificationsAPI from "../../notifications/services/GetNotifications.server";
import type { TNotifications } from "../../notifications/types/Notifications";
import toast from "react-hot-toast";

// Props que recibe el Provider
type Props = {
  children: React.ReactNode;
};

// Provider principal que controla la sesión de cualquier usuario (estudiante o maestro)
export const UserProvider = ({ children }: Props) => {
  const handleBtnNavigate = useNavigationHandler();

  // Estado para el usuario actual (estudiante o maestro)
  const [user, setUser] = useState<TUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<TNotifications>([]);
  const [isReady, setIsReady] = useState(false);

  // Carga inicial: verifica si hay sesión guardada
  useEffect(() => {
    const storedToken = authStorage.getToken();
    const storedUser = authStorage.getUser();
    const storedNotifications = authStorage.getNotifications();

    // Si hay token pero no usuario, obtener información del backend
    if (storedToken && !storedUser) {
      const loadUserInfo = async () => {
        try {
          // Por ahora solo cargamos estudiantes, después agregaremos maestros
          const dataStudent = await GetStudentAPI();
          
          // Convertir datos del estudiante
          const userData: TUser = {
            id: dataStudent.user_data.id,
            numIdentification: dataStudent.user_data.identification_number,
            name: dataStudent.user_data.names,
            lastNames: dataStudent.user_data.last_names,
            email: dataStudent.user_data.email,
            prefixProfile: dataStudent.prefix_profile
          };

          // Cargar notificaciones
          const dataNotifications = await GetNotificationsAPI();
          
          // Guardar en localStorage
          authStorage.setUser(userData);
          authStorage.setNotifications(dataNotifications);
          
          // Actualizar estado
          setUser(userData);
          setRole('student');
          setNotifications(dataNotifications);
        } catch (error) {
          console.error('Error cargando información del usuario:', error);
        }
      };
      
      loadUserInfo();
    }

    // Si hay sesión guardada, restaurar
    if (storedUser && storedToken && storedNotifications) {
      setUser(storedUser);
      setToken(storedToken);
      setNotifications(storedNotifications);
    }

    setIsReady(true);
  }, []);

  // Verificar si el usuario está logueado
  const isLoggedIn = !!user && !!role;

  // Función que cierra sesión
  const logout = () => {
    authStorage.removeToken();
    authStorage.removeUser();
    authStorage.removeNotifications();
    authStorage.removeCourses();
    
    setUser(null);
    setRole(null);
    setToken(null);
    setNotifications([]);
    
    toast.success('Sesión cerrada');
    handleBtnNavigate("/");
  };

  const numberNotifications = notifications.length;

  return (
    <UserContext.Provider value={{
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
      numberNotifications
    }}>
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

// Mantener el nombre anterior para compatibilidad
export const StudentProvider = UserProvider;
