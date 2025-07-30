// src/modules/courses/context/CourseContext.tsx
import { useContext } from "react";
/* Verificar que problema hay */
import { StudentCourseContext } from "../context/StudentCourseContext";
export const useStudentCourseContext = () => {
  const context = useContext(StudentCourseContext);
  if (!context) throw new Error("CourseContext no está disponible");
  return context;
};
