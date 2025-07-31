import { createContext } from "react";
// Importar tipo unificado en lugar de solo estudiantes
import type { TUserContext } from "../../types/User";

// Contexto unificado que maneja cualquier usuario
export const UserContext = createContext<TUserContext>({} as TUserContext);
