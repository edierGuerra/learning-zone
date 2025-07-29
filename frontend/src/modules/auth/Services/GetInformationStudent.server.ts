/* Servicio que obtiene los datos del estudiante desde el backend usando el token */
import axios from "../../../api/axiosInstance";
import type { TStudent } from "../../types/User";

const VITE_GETSTUDENT_ENDPOINT = import.meta.env.VITE_GETSTUDENT_ENDPOINT;

// Estructura esperada para los datos del usuario
type TUserDataResponse = {
    id: TStudent['id'];
    identification_number: TStudent['numIdentification'];
    names: TStudent['name'];
    last_names: TStudent['lastNames'];
    email: TStudent['email'];
};

// Estructura completa de la respuesta del API
type StudentAPIResponse = {
    status: number;
    message: string;
    user_data: TUserDataResponse;
    prefix_profile: string;
};

/**
 * Obtiene la información del estudiante autenticado desde el backend.
 * Valida status code y estructura de la respuesta.
 */
export async function GetStudentAPI(): Promise<TUserDataResponse & { prefix_profile: string }> {
    try {
        const response = await axios.get(VITE_GETSTUDENT_ENDPOINT);

        // Validar código de respuesta
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura
        const data = response.data as StudentAPIResponse;
        if (!data.user_data || typeof data.prefix_profile !== "string") {
            throw new Error("Respuesta del servidor inválida: falta información de usuario");
        }

        // Combinar datos del usuario con el prefijo de perfil
        return {
            ...data.user_data,
            prefix_profile: data.prefix_profile,
        };

    } catch (error) {
        console.error("Error en GetStudentAPI:", error);
        throw error;
    }
}
