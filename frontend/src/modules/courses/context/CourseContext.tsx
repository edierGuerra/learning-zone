import { createContext } from "react";
import type { TCourseContextType } from "../types/Course";

export const CourseContext = createContext<TCourseContextType>({} as TCourseContextType);
