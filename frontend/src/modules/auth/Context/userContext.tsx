import { createContext } from "react";
// ✅ CAMBIO: Importar tipo unificado en lugar de solo estudiantes
import type { TUserContext } from "../../types/User";

// ✅ NUEVO: Contexto unificado que maneja cualquier usuario
export const UserContext = createContext<TUserContext>({} as TUserContext);