/* Serivicio que se encarga de obtener el progreso del estudiante del estudiante */

import axios from '../../../api/axiosInstance';
import type { TProgressCourses } from '../../courses/types/Course';

const VITE_GETCOURSES_ENDPOINT = import.meta.env.VITE_GETCOURSES_ENDPOINT;

// Tipo para la respuesta esperada según el estándar
type ProgressAPIResponse = {
    status: number;
    message: string;
    data: TProgressCourses;
};

export default async function ProgressCoursesAPI(): Promise<TProgressCourses> {
    try {
        const response = await axios.get(`${VITE_GETCOURSES_ENDPOINT}/lessons`);
        console.log(response.data)
        
        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura de respuesta
        const responseData = response.data as ProgressAPIResponse;
        if (!responseData.data || !Array.isArray(responseData.data)) {
            throw new Error('Respuesta del servidor inválida: estructura de progreso incorrecta');
        }

        console.log(responseData.data);
        return responseData.data;

    } catch (error) {
        console.error('Error en ProgressCourses:', error);
        throw error;
    }
}
