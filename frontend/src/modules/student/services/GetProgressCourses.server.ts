/* Serivicio que se encarga de obtener el progreso del estudiante del estudiante */

import axios from '../../../api/axiosInstance';
import type { TProgressCourses } from '../../courses/types/CourseStudent';

// Usar ruta base para progreso de cursos específico
const COURSES_BASE_ENDPOINT = "/api/v1/student/courses";

// Tipo para la respuesta esperada según el estándar
type ProgressAPIResponse = {
    status: number;
    message: string;
    progress: TProgressCourses;
};

export default async function ProgressCoursesAPI(): Promise<TProgressCourses> {
    try {
        const response = await axios.get(`${COURSES_BASE_ENDPOINT}/lessons`);
        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura de respuesta
        const responseData = response.data as ProgressAPIResponse;
        if (!responseData.progress || !Array.isArray(responseData.progress)) {
            throw new Error('Respuesta del servidor inválida: estructura de progreso incorrecta');
        }

        console.log(responseData.progress);
        return responseData.progress;

    } catch (error) {
        console.error('Error en ProgressCourses:', error);
        throw error;
    }
}
