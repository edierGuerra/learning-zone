import type { TNotifications } from "../notifications/types/Notifications";

// Representa el modelo base de un estudiante (estructura completa, usada para registro o autenticación).
export type TStudent = {
  id: number;
  numIdentification: number;
  name: string;
  lastNames: string;
  email: string;
  password: string; 
};

// Representa los datos mínimos que retorna el backend tras un login exitoso.
// Se suele guardar en localStorage o en un contexto de sesión.
export type TStudentProfileToken = {
  name: TStudent['name'];     // Nombre del usuario autenticado
  email: TStudent['email'];   // Email del usuario autenticado
  token: string;              // Token JWT usado para proteger las rutas privadas
};

// Define la estructura del perfil del estudiante visible en la interfaz.
// Excluye el password y el token.
// Ideal para mostrar datos del usuario en dashboards, encabezados o perfiles.
export type TStudentProfile = {
  id: TStudent['id'];
  numIdentification: TStudent['numIdentification'];
  name: TStudent['name'];
  lastNames: TStudent['lastNames'];
  email: TStudent['email'];
  prefixProfile: string; // Campo útil para mostrar iniciales, títulos o avatar textual
};

// Define la estructura del contexto de sesión del estudiante en React.
// Se usa para compartir globalmente el estado de autenticación y control de sesión.
export type StudentContextType = {
  student: TStudentProfile | null; // Perfil actual del usuario logueado
  token: TStudentProfileToken["token"] | null; // Token JWT actual
  isLoggedIn: boolean; // Indica si el usuario está autenticado
  logout: () => void; // Función para cerrar sesión
  isReady: boolean; 
  setStudent: React.Dispatch<React.SetStateAction<TStudentProfile | null>>; // Setter para actualizar el perfil
  setToken: React.Dispatch<React.SetStateAction<string | null>>; // Setter para actualizar el token
  notifications:TNotifications;
  setNotifications:React.Dispatch<React.SetStateAction<TNotifications>>;
  numberNotifications:number

};
