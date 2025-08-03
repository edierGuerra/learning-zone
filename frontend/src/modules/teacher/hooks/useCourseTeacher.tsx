// src/modules/courses/context/CourseContext.tsx
import { useContext } from "react";
import { TeacherCourseContext } from "../context/TeacherCourseContext";
/* Verificar que problema hay */
export const useTeacherCourseContext = () => {
  const context = useContext(TeacherCourseContext);
  if (!context) throw new Error("CourseContext no está disponible");
  return context;
};
