/* Servicio encargado de actualizar una leccion */
/* Servicio que se encarga de solicitar todo la info de la leccion, el contenido y la evaluacion   */
/* Serivicio que se encarga de obtener los cursos del estudiante */

import axios from '../../../../api/axiosInstance';
import type {TCourseTeacherResponse, TLessonTeacherResponse, TLessonTeacherSend } from '../../types/Teacher';

const VITE_TEACHER_ENDPOINT = import.meta.env.VITE_TEACHER_ENDPOINT;

// Tipo para la respuesta esperada según el estándar
type TUpdateLessonAPIResponse = {
  status: number;
  message: string;
};

type TUpdateLessonAPIProps ={
    idCourse:TCourseTeacherResponse['id'],
    idLesson: TLessonTeacherResponse['id'],
    lessonContent:TLessonTeacherSend,
}


export default async function UpdateLessonAPI({idCourse, idLesson, lessonContent}:TUpdateLessonAPIProps): Promise<TUpdateLessonAPIResponse> {
    try {
        const formData = new FormData();
        formData.append("name", lessonContent.name);
        formData.append("content_type", lessonContent.content.content_type);
        formData.append("text", lessonContent.content.text);
        if (lessonContent.content.file) {
            formData.append("file", lessonContent.content.file);
        }
        const id_course = idCourse
        const id_lesson = idLesson
        const response = await axios.put(`${VITE_TEACHER_ENDPOINT}/courses/${id_course}/lessons/${id_lesson}`,{formData},{
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });

        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura de respuesta
        const responseData = response.data as TUpdateLessonAPIResponse;
        if (!responseData.message || !Array.isArray(responseData.message)) {
            throw new Error('Respuesta del servidor inválida: estructura de datos incorrecta');
        }

        return responseData;

    } catch (error) {
        console.error('Error en GetCourses:', error);
        throw error;
    }
}
