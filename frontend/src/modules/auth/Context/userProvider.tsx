import React, { useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { authStorage } from "../../../shared/Utils/authStorage"; // Módulo que gestiona localStorage (guardar y obtener token/user)
import type { TStudentProfile } from "../../types/User";
import { useNavigationHandler } from "../../../hooks/useNavigationHandler"; // Hook personalizado para manejar navegación sin usar useNavigate directo
import { GetStudentAPI } from "../Services/GetInformationStudent.server";

// Props que recibe el Provider: los hijos que van dentro del contexto
type Props = {
  children: React.ReactNode;
};

// Provider principal que controla todo lo relacionado con la sesión del estudiante
export const StudentProvider = ({ children }: Props) => {
  const handleBtnNavigate = useNavigationHandler(); // Instancia del hook para redirigir

  // Estado para guardar el token y el usuario actual
  const [token, setToken] = useState<string | null>(null);
  const [student, setStudent] = useState<TStudentProfile | null>(null);

  // Estado para confirmar que ya se cargó la sesión al iniciar la app
  const [isReady, setIsReady] = useState(false);

  

  // Carga inicial: verifica si hay token y usuario guardados en localStorage
  useEffect(() => {
    const storedToken = authStorage.getToken();  // Trae el token guardado si existe
    const storedStudent = authStorage.getUser(); // Trae el usuario guardado si existe
    if(storedToken && !storedStudent){
      // SI existe un token ejeuctar el services que envia el token al backen y obtiene la info del estudiante
      const infoStudent = async ()=>{
        // Accediendo al backend y obteniendo la info
        const dataStudent = await GetStudentAPI();
        // Conversion de sintaxis
        const dataStudentLocalStorage:TStudentProfile ={
          id:dataStudent.user_data.id,
          numIdentification:dataStudent.user_data.identification_number,
          name:dataStudent.user_data.names,
          lastNames:dataStudent.user_data.last_names,
          email: dataStudent.user_data.email,
          prefixProfile: dataStudent.prefix_profile
        }
        // Almacenando la informacion del estudiante en el localStorage
        authStorage.setStudent(dataStudentLocalStorage)
        setStudent(dataStudentLocalStorage)
      }
      infoStudent()
    }
    // Recuperar la informacion del usuario
    // Si hay sesión guardada, se setean los valores
    if (storedStudent && storedToken) {
      setStudent(storedStudent);
      setToken(storedToken);
    }

    // Marca que ya terminó la validación de la sesión inicial
    setIsReady(true);
  }, []);

  // Booleano que indica si el usuario está logueado (se basa en si hay un usuario en estado)
  const isLoggedIn =  !!student;


  // Función que cierra sesión: limpia todo lo guardado y redirige al inicio
  const logout = () => {
    authStorage.removeToken();     // Elimina token del almacenamiento
    authStorage.removeUser();      // Elimina usuario del almacenamiento
    setStudent(null);              // Limpia usuario en estado global
    setToken(null);                // Limpia token en estado global
    handleBtnNavigate("/");        // Redirige al inicio (se podrias usar replace si deseas evitar retroceder),
  };

  return (
    // El Provider envuelve toda la app y expone el contexto con los valores globales
    <UserContext.Provider value={{  student,
    token,
    logout,
    isLoggedIn,
    isReady,
    setStudent,
    setToken }}>
      {/* Solo renderiza la app si ya se hizo la validación inicial de sesión */}
      {isReady ? children : null}
    </UserContext.Provider>
  );
};
