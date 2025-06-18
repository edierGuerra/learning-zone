import { createContext } from "react";
import type { UserContextType } from "../../types/User"; // ajusta la ruta según tu estructura

export const UserContext = createContext<UserContextType>({} as UserContextType);
