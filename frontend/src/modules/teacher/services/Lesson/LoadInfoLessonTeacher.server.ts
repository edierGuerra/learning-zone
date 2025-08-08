/* Servicio que se encarga de solicitar todo la info de la leccion, el contenido y la evaluacion   */
/* Serivicio que se encarga de obtener los cursos del estudiante */

import axios from '../../../../api/axiosInstance';
import type {TCourseTeacherResponse, TLessonContentResponse, TLessonTeacherResponse } from '../../types/Teacher';

const VITE_TEACHER_ENDPOINT = import.meta.env.VITE_TEACHER_ENDPOINT;

// Tipo para la respuesta esperada según el estándar

type TGetLessonAPIResponse = {
  status: number;
  message: string;
  lesson: TLessonContentResponse; /* Cambiar lo que recibe del backend: que seria todo, el contenido y la evaluacion ya que esto se mostrar en una page para actualizar el curso */
};

type TGetLessonsAPIProps ={
    idCourse:TCourseTeacherResponse['id'],
    idLesson: TLessonTeacherResponse['id']
}

export default async function LoadInfoLessonTeacherAPI({idCourse, idLesson}:TGetLessonsAPIProps): Promise<TLessonContentResponse> {
    try {
        const id_course = idCourse
        const id_lesson = idLesson
        const response = await axios.get(`${VITE_TEACHER_ENDPOINT}/courses/${id_course}/lessons/${id_lesson}`);
        console.log(response)

        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura de respuesta
        const responseData = response.data as TGetLessonAPIResponse;
        if (!responseData.lesson || !Array.isArray(responseData.lesson)) {
            throw new Error('Respuesta del servidor inválida: estructura de datos incorrecta');
        }

        return responseData.lesson;

    } catch (error) {
        console.error('Error en GetCourses:', error);
        throw error;
    }
}
