/* Servicio que se conecta al backend para solicitar las lecciones de un cursos de un estudiante  */
import axios from '../../../api/axiosInstance';
import type {TCourse,TLesson } from '../types/Course';

const VITE_GETCOURSES_ENDPOINT = import.meta.env.VITE_GETCOURSES_ENDPOINT;

type TContentLessonsAPIResponse = {
    id: TLesson['id'],
    name: TLesson['name'],
    progress_state: TLesson['progressState']
    category: TCourse['category']
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
        const response = await axios.get(`${VITE_GETCOURSES_ENDPOINT}/${id_course}/lessons`);
        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura de respuesta
        const responseData = response.data as LessonsAPIResponse;
        if (!responseData.lessons || !Array.isArray(responseData.lessons)) {
            throw new Error('Respuesta del servidor inválida: estructura de lecciones incorrecta');
        }

        console.log(responseData.lessons);
        return responseData.lessons;

    } catch (error) {
        console.error('Error en Get lessons:', error);
        throw error;
    }
}
