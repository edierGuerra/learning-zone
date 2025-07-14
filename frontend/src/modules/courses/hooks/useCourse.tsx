// src/modules/courses/context/CourseContext.tsx
import { useContext } from "react";
import { CourseContext } from "../context/CourseContext";

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error("CourseContext no está disponible");
  return context;
};
