/* agregar consulta al backend del rol y retornarlo */
import React, { useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { authStorage } from "../../../shared/Utils/authStorage";
import type { TUser, TUserRole } from "../../types/User";
import { useNavigationHandler } from "../../../hooks/useNavigationHandler";
import { GetStudentAPI } from "../Services/GetInformationStudent.server";
import GetNotificationsAPI from "../../notifications/services/GetNotifications.server";
import type { TNotifications } from "../../notifications/types/Notifications";
import toast from "react-hot-toast";
import { GetRoleUserAPI } from "../Services/GetRoleUser.server";
import { GetTeacherAPI } from "../Services/GetInformationTeacher.server";

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
  const [notifications, setNotifications] = useState<TNotifications>([]);
  const [isReady, setIsReady] = useState(false);

  // Carga inicial: verifica si hay sesión guardada
  useEffect(() => {
    const storedToken = authStorage.getToken();
    const storedUser = authStorage.getUser();
    const storedNotifications = authStorage.getNotifications();
    const storedRole = authStorage.getRole();

    // Si hay token pero no usuario, obtener información del backend
    if (storedToken && !storedUser && !storedRole) {
      const loadUserInfo = async () => {
        try {
          /* Solicitar el rol al backend en enviando el token  */
          const roleUser = await GetRoleUserAPI();
          setRole(roleUser);
          authStorage.setRole(roleUser)

          if (roleUser === 'student') {
            const dataStudent = await GetStudentAPI();

            // Convertir datos del estudiante a TUser
            const userData: TUser = {
                id: dataStudent.id,
                numIdentification: dataStudent.identification_number,
                name: dataStudent.names,
                lastNames: dataStudent.last_names,
                email: dataStudent.email,
                prefixProfile: dataStudent.prefix_profile
            };

            // Guardar en localStorage y contexto
            authStorage.setUser(userData);
            setUser(userData);
        }else{
            const dataTeacher = await GetTeacherAPI();
            
            // Convertir datos del estudiante
            const userData: TUser = {
              id: dataTeacher.id,
              numIdentification:dataTeacher.identification_number,
              name:dataTeacher.names,
              lastNames:dataTeacher.last_names,
              email:dataTeacher.email,
              specialization:dataTeacher.specialization,
              prefixProfile:dataTeacher.prefix_profile
            };
            // Guardar en localStorage
            authStorage.setUser(userData);
            setUser(userData);

          }


          // Cargar notificaciones
          const dataNotifications = await GetNotificationsAPI();
          
          authStorage.setNotifications(dataNotifications);
          
          // Actualizar estado
          setNotifications(dataNotifications);
        } catch (error) {
          console.error('Error cargando información del usuario:', error);
        }
      };
      
      loadUserInfo();
    }

    // Si hay sesión guardada, restaurar
    if (storedUser && storedToken && storedNotifications && storedRole) {
      setUser(storedUser);
      setToken(storedToken);
      setNotifications(storedNotifications);
      setRole(storedRole)
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
