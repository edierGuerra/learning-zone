import { createContext } from "react";
import type { TStudentCourseContextType } from "../types/Course";

export const StudentCourseContext = createContext<TStudentCourseContextType>({} as TStudentCourseContextType);
