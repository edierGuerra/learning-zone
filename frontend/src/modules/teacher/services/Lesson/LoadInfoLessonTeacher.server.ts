/* Servicio que se encarga de solicitar todo la info de la leccion, el contenido y la evaluacion   */
/* Serivicio que se encarga de obtener los cursos del estudiante */

import axios from '../../../../api/axiosInstance';
import type { TLessonContentResponse, TLessonTeacherResponse } from '../../types/Teacher';

const VITE_TEACHER_ENDPOINT = import.meta.env.VITE_TEACHER_ENDPOINT;


export default async function LoadInfoLessonTeacherAPI( idLesson: TLessonTeacherResponse['id']): Promise<TLessonContentResponse> {
    try {
        const id_lesson = idLesson
        const response = await axios.get(`${VITE_TEACHER_ENDPOINT}/courses/lesson/${id_lesson}`);

        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura de respuesta
/*         const responseData = response.data as TGetLessonAPIResponse;
        if (!responseData || !Array.isArray(responseData)) {
            throw new Error('Respuesta del servidor inválida: estructura de datos incorrecta');
        } */
       console.log(response)
        return response.data;

    } catch (error) {
        console.error('Error en getInfoLesson:', error);
        throw error;
    }
}
