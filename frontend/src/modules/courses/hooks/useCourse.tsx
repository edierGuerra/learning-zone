// src/modules/courses/context/CourseContext.tsx
import { useContext } from "react";
import { StudentCourseContext } from "../context/studentCourseContext";

export const useStudentCourseContext = () => {
  const context = useContext(StudentCourseContext);
  if (!context) throw new Error("CourseContext no está disponible");
  return context;
};
