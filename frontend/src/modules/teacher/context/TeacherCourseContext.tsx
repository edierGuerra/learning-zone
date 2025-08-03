import { createContext } from "react";
import type { TTeacherCourseContextType } from "../types/Teacher";

export const TeacherCourseContext = createContext<TTeacherCourseContextType>({} as TTeacherCourseContextType);
