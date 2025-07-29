// PARA MAYOR SEGURIDAD MIGRAR ESTO A COOKIES
// Importa los tipos de datos definidos para el usuario y su token
import type { TComment, TStudentAllComents } from "../../modules/courses/comments/types";
import type { TContent, TCourses, TEvaluation, TLesson, TLessons } from "../../modules/courses/types/Course";
import type { TNotifications } from "../../modules/notifications/types/Notifications";
import type { TStudent, TStudentConsent, TStudentProfile, TStudentProfileToken, TUser } from "../../modules/types/User";

// Objeto que encapsula el acceso al almacenamiento local (localStorage)
export const authStorage = {
  setCookieConsentGiven :(consentObject:TStudentConsent)=>
    localStorage.setItem('cookieConsentGiven',JSON.stringify(consentObject)),

  getCookieConsentGiven:():TStudentConsent | null =>{
    try {
      const raw = localStorage.getItem("cookieConsentGiven");
      return raw ? (JSON.parse(raw) as TStudentConsent) : null;
    } catch (e) {
      console.error("El JSON está mal formado :", e);
      return null;
    }
  },
  removeCookieConsentGiven:()=>localStorage.removeItem('CookieConsentGiven'),

  // Guarda el usuario unificado (estudiante o maestro)
  setUser: (user: TUser) =>
    localStorage.setItem("user", JSON.stringify(user)),

  // Recupera el usuario unificado desde localStorage
  getUser: (): TUser | null => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as TUser) : null;
    } catch (e) {
      console.error("El JSON está mal formado :", e);
      return null;
    }
  },

  // Elimina el usuario del localStorage
  removeUser: () => localStorage.removeItem("user"),


  setAllStudents:(allStudents:TStudentAllComents[])=>
    localStorage.setItem('allStudents',JSON.stringify(allStudents)),
  getAllStudents:():TStudentAllComents[] | null =>{
    try {
      const raw = localStorage.getItem("allStudents");
      return raw ? (JSON.parse(raw) as TStudentAllComents[]) : null;
    } catch (e) {
      console.error("El JSON está mal formado :", e);
      return null;
    }

  },
  removeAllStudents:() => localStorage.removeItem('allStudents'),

  setComments:(comments:TComment[])=>
    localStorage.setItem('comments',JSON.stringify(comments)),
  getComments:():TComment[] | null =>{
    try {
      const raw = localStorage.getItem("comments");
      return raw ? (JSON.parse(raw) as TComment[]) : null;
    } catch (e) {
      console.error("El JSON está mal formado :", e);
      return null;
    }

  },
  removeComments:() => localStorage.removeItem('comments'),

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

  setNotifications: (notifications: TNotifications) => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  },

  getNotifications: (): TNotifications => {
    try {
      const raw = localStorage.getItem("notifications");
      return raw ? (JSON.parse(raw) as TNotifications) : [];
    } catch (e) {
      console.error("El JSON está mal formado:", e);
      return [];
    }
  },

  removeNotifications: () => localStorage.removeItem('notifications'),

  setCourse:(courses:TCourses)=>{
    localStorage.setItem('courses',JSON.stringify(courses))
  },
  getCourses:():TCourses =>{
    try {
      const raw = localStorage.getItem("courses");
      return raw ? (JSON.parse(raw) as TCourses) : [];
    } catch (e) {
      console.error("El JSON está mal formado:", e);
      return [];
    }

  },
  removeCourses:()=>localStorage.removeItem('courses'),


  setLessons:(lessons:TLessons)=>{
    localStorage.setItem('lessons',JSON.stringify(lessons))
  },
  getLessons:():TLessons =>{
    try {
      const raw = localStorage.getItem("lessons");
      return raw ? (JSON.parse(raw) as TLessons) : [];
    } catch (e) {
      console.error("El JSON está mal formado:", e);
      return [];
    }
  },
  removeLessons:()=>localStorage.removeItem('lessons'),

  setLesson: (lesson: TLesson) =>
    localStorage.setItem("lesson", JSON.stringify(lesson)),

  // Recupera el objeto de contenido desde localStorage
  getLesson: (): TLesson | null => {
    try {
      const raw = localStorage.getItem("lesson");
      return raw ? (JSON.parse(raw) as TLesson) : null;
    } catch (e) {
      console.error("El JSON está mal formado :", e);
      return null;
    }
  },

  // Elimina el content del localStorage
  removeLesson: () => localStorage.removeItem("lesson"),

  setContent: (content: TContent) =>
    localStorage.setItem("content", JSON.stringify(content)),

  // Recupera el objeto de contenido desde localStorage
  getContent: (): TContent | null => {
    try {
      const raw = localStorage.getItem("content");
      return raw ? (JSON.parse(raw) as TContent) : null;
    } catch (e) {
      console.error("El JSON está mal formado :", e);
      return null;
    }
  },

  // Elimina el content del localStorage
  removeContent: () => localStorage.removeItem("content"),

  setEvaluation: (evaluation: TEvaluation) =>
    localStorage.setItem("evaluation", JSON.stringify(evaluation)),

  // Recupera el objeto de contenido desde localStorage
  getEvaluation: (): TEvaluation | null => {
    try {
      const raw = localStorage.getItem("evaluation");
      return raw ? (JSON.parse(raw) as TEvaluation) : null;
    } catch (e) {
      console.error("El JSON está mal formado :", e);
      return null;
    }
  },

  // Elimina la evaluation del localStorage
  removeEvaluation: () => localStorage.removeItem("evaluation"),
};
