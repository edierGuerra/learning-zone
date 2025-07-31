/* Servicio que solicitara al backend el contenido de una respectiva leccion */
import axios from '../../../api/axiosInstance';
import type { TContent, TCourse, TLesson } from '../types/Course';

const VITE_GETCOURSES_ENDPOINT = import.meta.env.VITE_GETCOURSES_ENDPOINT;

type ContentLessonsAPIProps = {
    idCourse: TCourse['id'],
    idLesson: TLesson['id']
}

type TContentLessonsAPIResponse = {
    id: TContent['id'],
    content_type: TContent['contentType'],
    content: TContent['content'],
    text: TContent['text']
}

// Tipo para la respuesta esperada según el estándar
type ContentAPIResponse = {
    status: number;
    message: string;
    content: TContentLessonsAPIResponse;
};

export default async function ContentLessonsAPI({idCourse, idLesson}: ContentLessonsAPIProps): Promise<TContentLessonsAPIResponse> {
    try {
        const id_course = idCourse;
        const id_lesson = idLesson;
        const response = await axios.get(`${VITE_GETCOURSES_ENDPOINT}/${id_course}/lessons/${id_lesson}/content`);


        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura de respuesta
        const responseData = response.data as ContentAPIResponse;
        if (!responseData.content || typeof responseData.content !== 'object') {
            throw new Error('Respuesta del servidor inválida: estructura de contenido incorrecta');
        }

        return responseData.content;

    } catch (error) {
        console.error('Error en ContentLessons:', error);
        throw error;
    }
}
