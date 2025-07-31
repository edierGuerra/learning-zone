/* Servicio que envia el token y recibe el rol */
/* Servicio que envia el email del usuario que desea recuperar la contraseña al backend */
import axios from "../../../api/axiosInstance";
import type { TUserRole } from "../../types/User";

const VITE_GETROLEUSER_ENDPOINT = import.meta.env.VITE_GETROLEUSER_ENDPOINT;

type GetRoleUserAPIResponse ={
    status: number;
    message: string;
    role: TUserRole;
}
export const GetRoleUserAPI = async ():Promise<TUserRole> => {
 try {
        const response = await axios.get(`${VITE_GETROLEUSER_ENDPOINT}`);
        console.log(response.data)
        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura de respuesta
        const responseData = response.data as GetRoleUserAPIResponse;
        if (!responseData.role || !Array.isArray(responseData.role)) {
            throw new Error('Respuesta del servidor inválida: estructura de progreso incorrecta');
        }

        console.log(responseData.role);
        return responseData.role;

    } catch (error) {
        console.error('Error en ProgressCourses:', error);
        throw error;
    }
}
