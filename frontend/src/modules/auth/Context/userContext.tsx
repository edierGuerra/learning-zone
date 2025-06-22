import { createContext } from "react";
import type { StudentContextType } from "../../types/User";

export const UserContext = createContext<StudentContextType>({} as StudentContextType);
