import axios from "../../../api/axiosInstance";
import type { TTeacher } from "../../types/User";

const VITE_TEACHER_ENDPOINT = import.meta.env.VITE_TEACHER_ENDPOINT;

/**
 * Estructura de los datos específicos del profesor que retorna el backend.
 */
type TTeacherDataResponse = {
  id: number;
  names: TTeacher["name"];
  last_names: string;
  email: TTeacher["email"];
  specialization: string;
  prefix_profile: string;
};

/**
 * Estructura esperada de la respuesta del backend para el endpoint del profesor.
 */
/* type TeacherAPIResponse = {
  status: number;
  message: string;
  data: TTeacherDataResponse;
}; */

/**
 * Servicio que obtiene la información del profesor autenticado desde el backend.
 * Lanza errores en caso de respuesta inválida o fallo en el endpoint.
 */
export async function GetTeacherAPI(): Promise<TTeacherDataResponse> {
  try {
    const response = await axios.get(VITE_TEACHER_ENDPOINT);

    // Validar código de estado HTTP
    if (response.status !== 200) {
      throw new Error(
        `HTTP ${response.status}: ${response.data?.message || "Error inesperado del servidor"}`
      );
    }
    console.log(response)

    const data = response.data as TTeacherDataResponse;

    // Validación superficial de estructura (mejor usar zod o similar si es crítico)
    if (!data || typeof data !== "object") {
      throw new Error("Respuesta del servidor inválida: datos del profesor no presentes");
    }
    return data
  } catch (error) {
    console.error("Error al obtener los datos del profesor:", error);
    throw error;
  }
}
