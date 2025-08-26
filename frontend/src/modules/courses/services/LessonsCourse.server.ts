/* Servicio que se conecta al backend para solicitar las lecciones de un cursos de un estudiante  */
import axios from '../../../api/axiosInstance';
import type {TCourse, TLessonStudent } from '../types/CourseStudent';

// Usar ruta base para lecciones específicas (no la misma que para lista de cursos)
const COURSES_BASE_ENDPOINT = "/api/v1/student/courses";

type TContentLessonsAPIResponse = {
    id: TLessonStudent['id'],
    name: TLessonStudent['name'],
    progress_state: TLessonStudent['progressState']
}

// Tipo para la respuesta esperada según el estándar
type LessonsAPIResponse = {
    status: number;
    message: string;
    lessons: TContentLessonsAPIResponse[];
};

export default async function LessonsCourseAPI(idCourse: TCourse['id']): Promise<TContentLessonsAPIResponse[]> {
    try {
        const id_course = idCourse;
        const response = await axios.get(`${COURSES_BASE_ENDPOINT}/${id_course}/lessons`);
        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura de respuesta
        const responseData = response.data as LessonsAPIResponse;
        if (!responseData.lessons || !Array.isArray(responseData.lessons)) {
            throw new Error('Respuesta del servidor inválida: estructura de lecciones incorrecta');
        }

        return responseData.lessons;

    } catch (error) {
        console.error('Error en Get lessons:', error);
        throw error;
    }
}
