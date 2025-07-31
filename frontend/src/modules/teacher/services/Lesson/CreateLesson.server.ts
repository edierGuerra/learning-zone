/* Servicio encargado de crear una leccion */

/* Servicio que solicita los cursos de una categoria en especifico */
/* Serivicio que se encarga de obtener los cursos del estudiante */

import axios from '../../../../api/axiosInstance';
import type { TLessonTeacherResponse, TLessonTeacherSend } from '../../types/Teacher';

const VITE_TEACHER_ENDPOINT = import.meta.env.VITE_TEACHER_ENDPOINT;

// Tipo para la respuesta esperada según el estándar
type TCreateLessonAPIResponse={
    status:number
    message: string;
    id_lesson: TLessonTeacherResponse['id'];
};



export default async function CreateLessonAPI(lesson:TLessonTeacherSend): Promise<TLessonTeacherResponse['id']> {
    try {
        const id_course = lesson.idCourse
        const formData = new FormData();
        formData.append("name", lesson.name);
        formData.append("content_type", lesson.content.contentType);
        formData.append("text", lesson.content.text);
        if (lesson.content.file) {
            formData.append("file", lesson.content.file);
        }


        const response = await axios.post(`${VITE_TEACHER_ENDPOINT}/courses/${id_course}/lessons`, formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });

        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura de respuesta
        const responseData = response.data as TCreateLessonAPIResponse;
        if (!responseData.id_lesson || !Array.isArray(responseData.id_lesson)) {
            throw new Error('Respuesta del servidor inválida: estructura de datos incorrecta');
        }

        return responseData.id_lesson;

    } catch (error) {
        console.error('Error en GetCourses:', error);
        throw error;
    }
}
