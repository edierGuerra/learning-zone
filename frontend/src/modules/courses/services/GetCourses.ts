/* Serivicio que se encarga de obtener los cursos del estudiante */

import axios from '../../../api/axiosInstance';
import type {TCourses } from '../types/Course';

const VITE_GETCOURSES_ENDPOINT = import.meta.env.VITE_GETCOURSES_ENDPOINT;

// Tipo para la respuesta esperada según el estándar
type GetCoursesAPIResponse = {
  status: number;
  message: string;
  data: TCourses;
};

export default async function GetCoursesAPI(): Promise<TCourses> {
    try {
        const response = await axios.get(VITE_GETCOURSES_ENDPOINT);
        
        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura de respuesta
        const responseData = response.data as GetCoursesAPIResponse;
        if (!responseData.data || !Array.isArray(responseData.data)) {
            throw new Error('Respuesta del servidor inválida: estructura de datos incorrecta');
        }

        return responseData.data;

    } catch (error) {
        console.error('Error en GetCourses:', error);
        throw error;
    }
}
