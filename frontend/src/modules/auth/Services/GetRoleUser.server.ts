/* Servicio que consulta el rol del usuario autenticado */
import axios from "../../../api/axiosInstance";
import type { TUserRole } from "../../types/User";

const VITE_GETROLEUSER_ENDPOINT = import.meta.env.VITE_GETROLEUSER_ENDPOINT;

type GetRoleUserAPIResponse = {
  status: number;
  message: string;
  role: TUserRole;
};

export const GetRoleUserAPI = async (): Promise<TUserRole> => {
  try {
    const response = await axios.get(`${VITE_GETROLEUSER_ENDPOINT}`);

    if (response.status !== 200) {
      throw new Error(
        `HTTP ${response.status}: ${response.data?.message || "Error desconocido"}`
      );
    }

    const responseData = response.data as GetRoleUserAPIResponse;

    // Validar que el rol sea válido
    const validRoles: TUserRole[] = ["student", "teacher"];
    if (!responseData.role || !validRoles.includes(responseData.role)) {
      throw new Error(
        `Respuesta del servidor inválida: rol no reconocido (${responseData.role})`
      );
    }

    console.log("✅ Rol obtenido:", responseData.role);
    return responseData.role;
  } catch (error) {
    console.error("❌ Error al obtener el rol del usuario:", error);
    throw error;
  }
};
