// PARA MAYOR SEGURIDAD MIGRAR ESTO A COOKIES
// Importa los tipos de datos definidos para el usuario y su token

import type { TStudentProfile, TStudentProfileToken } from "../../modules/types/User";

// Objeto que encapsula el acceso al almacenamiento local (localStorage)
export const authStorage = {
  
  // Guarda el objeto de usuario en localStorage bajo la clave "user"
  setStudent: (student: TStudentProfile) =>
    localStorage.setItem("student", JSON.stringify(student)),

  // Recupera el objeto de usuario desde localStorage
  getUser: (): TStudentProfile | null => {
    try {
      const raw = localStorage.getItem("student");
      // Intenta parsear el string a un objeto; si falla, devuelve null
      return raw ? JSON.parse(raw) as TStudentProfile : null;
    } catch (e) {
      console.error("El JSON está mal formado :", e);
      return null;
    }
  },

  // Elimina el usuario del localStorage
  removeUser: () => localStorage.removeItem("student"),

  // Guarda el token de autenticación en localStorage bajo la clave "token"
  setToken: (token: TStudentProfileToken["token"]) =>
    localStorage.setItem("token", token),

  // Recupera el token desde localStorage
  getToken: (): string | null => localStorage.getItem("token"),

  // Elimina el token del localStorage
  removeToken: () => localStorage.removeItem("token"),
};
