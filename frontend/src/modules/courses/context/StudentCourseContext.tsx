import { createContext } from "react";
import type { TStudentCourseContextType } from "../types/CourseStudent";

export const StudentCourseContext = createContext<TStudentCourseContextType>({} as TStudentCourseContextType);
