/* Servicio que obtiene los datos del profesor desde el backend usando el token */
import axios from "../../../api/axiosInstance";
import type { TTeacher } from "../../types/User";

const VITE_TEACHER_ENDPOINT = import.meta.env.VITE_TEACHER_ENDPOINT;

// Estructura esperada para los datos del profesor
type TTeacherDataResponse = {
    id: TTeacher['id'];
    identification_number: TTeacher['numIdentification'];
    names: TTeacher['name'];
    last_names: TTeacher['lastNames'];
    email: TTeacher['email'];
    specialization: TTeacher['specialization'];
};

// Estructura completa de la respuesta del API
type TeacherAPIResponse = {
    status: number;
    message: string;
    user_data: TTeacherDataResponse;
    prefix_profile: string;
};

/**
 * Obtiene la información del profesor autenticado desde el backend.
 * Valida status code y estructura de la respuesta.
 */
export async function GetTeacherAPI(): Promise<TTeacherDataResponse & { prefix_profile: string }> {
    try {
        const response = await axios.get(VITE_TEACHER_ENDPOINT);

        // Validar código de respuesta
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || "Error desconocido"}`);
        }

        // Validar estructura
        const data = response.data as TeacherAPIResponse;
        if (!data.user_data || typeof data.prefix_profile !== "string") {
            throw new Error("Respuesta del servidor inválida: falta información del profesor");
        }

        // Devolver datos combinados en un solo objeto plano
        return {
            ...data.user_data,
            prefix_profile: data.prefix_profile,
        };

    } catch (error) {
        console.error("Error en GetTeacherAPI:", error);
        throw error;
    }
}
