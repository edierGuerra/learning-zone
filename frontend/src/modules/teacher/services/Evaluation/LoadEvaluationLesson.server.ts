

import axios from '../../../../api/axiosInstance';
import type { TEvaluation } from '../../../courses/types/CourseStudent';
import type {TCourseTeacherResponse, TLessonTeacherResponse } from '../../types/Teacher';

const VITE_TEACHER_ENDPOINT = import.meta.env.VITE_TEACHER_ENDPOINT;

// Tipo para la respuesta esperada según el estándar
type TEvaluationLessonsTeacher ={
    question_type: TEvaluation["questionType"];
    question: TEvaluation["question"];
    options: TEvaluation["options"];
    correct_answer:string


}
type TGetLessonAPIResponse = {
  status: number;
  message: string;
  evaluation: TEvaluationLessonsTeacher; /* Cambiar lo que recibe del backend: que seria todo, el contenido y la evaluacion ya que esto se mostrar en una page para actualizar el curso */
};

type TLoadEvaluationLessonAPIProps ={
    idCourse:TCourseTeacherResponse['id'],
    idLesson: TLessonTeacherResponse['id']
}

export default async function LoadEvaluationLessonAPI({idCourse, idLesson}:TLoadEvaluationLessonAPIProps): Promise<TEvaluationLessonsTeacher> {
    try {
        const id_course = idCourse
        const id_lesson = idLesson
        const response = await axios.get(`${VITE_TEACHER_ENDPOINT}/courses/${id_course}/lessons/${id_lesson}/evaluation`);

        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura de respuesta
        const responseData = response.data as TGetLessonAPIResponse;
        if (!responseData.evaluation || !Array.isArray(responseData.evaluation)) {
            throw new Error('Respuesta del servidor inválida: estructura de datos incorrecta');
        }

        return responseData.evaluation;

    } catch (error) {
        console.error('Error en GetCourses:', error);
        throw error;
    }
}
