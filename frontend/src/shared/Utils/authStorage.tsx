// PARA MAYOR SEGURIDAD MIGRAR ESTO A COOKIES
// Importa los tipos de datos definidos para el usuario y su token
import type { TStudent, TStudentProfile, TStudentProfileToken } from "../../modules/types/User";

// Objeto que encapsula el acceso al almacenamiento local (localStorage)
export const authStorage = {
  // Guarda el objeto de usuario en localStorage bajo la clave "student"
  setStudent: (student: TStudentProfile) =>
    localStorage.setItem("student", JSON.stringify(student)),

  // Recupera el objeto de usuario desde localStorage
  getUser: (): TStudentProfile | null => {
    try {
      const raw = localStorage.getItem("student");
      return raw ? (JSON.parse(raw) as TStudentProfile) : null;
    } catch (e) {
      console.error("El JSON está mal formado :", e);
      return null;
    }
  },

  // Elimina el usuario del localStorage
  removeUser: () => localStorage.removeItem("student"),

  // Guarda el token de autenticación
  setToken: (token: TStudentProfileToken['token']) =>
    localStorage.setItem("token", token),

  getToken: (): string | null => localStorage.getItem("token"),

  removeToken: () => localStorage.removeItem("token"),
  
  // Token de request email
  setRequestEmailToken: (token: TStudentProfileToken['token']) =>
    localStorage.setItem("RequestEmailToken", token),

  getRequestEmailToken: (): string | null => localStorage.getItem("RequestEmailToken"),

  removeRequestEmailToken: () => localStorage.removeItem("RequestEmailToken"),


  // Email
  setEmail: (email: TStudentProfile["email"]) =>
    localStorage.setItem("email", email),

  getEmail: (): string | null => localStorage.getItem("email"),

  removeEmail: () => localStorage.removeItem("email"),

  // ID autoincrementable del estudiante
  setIdAutoIncrementStudent: (id: TStudent["id"]) =>
    localStorage.setItem("idAutoIncrementStudent", id.toString()),

  getIdAutoIncrementStudent: (): TStudent["id"] | null => {
    const value = localStorage.getItem("idAutoIncrementStudent");
    return value !== null ? Number(value) : null;
  },

  removeIdAutoIncrementStudent: () =>
    localStorage.removeItem("idAutoIncrementStudent"),
/*   
  setNameStudent:(name:TStudent['name'])=>
    localStorage.setItem('name', name),

  getNameStudent:(): TStudent['name'] | null =>
    localStorage.getItem('name'),

  removeNameStudent :()=> localStorage.removeItem('name'), */
  
    
};
