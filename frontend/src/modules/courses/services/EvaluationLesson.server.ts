/* Servicio que solicita al backend la evaluacion de una respectiva leccion */
import axios from '../../../api/axiosInstance';
import type {TCourseStudent, TEvaluation, TLessonStudent } from '../types/CourseStudent';

// Usar ruta base para evaluaciones de lecciones específicas
const COURSES_BASE_ENDPOINT = "/api/v1/student/courses";
/* Agregar en response un atributo score que es el puntaje */
type EvaluationLessonsAPIProps = {
    idCourse: TCourseStudent['id'],
    idLesson: TLessonStudent['id']
}

type TEvaluationLessonsAPIResponse = {
    id_evaluation: TEvaluation['id'],
    question: TEvaluation['question'],
    question_type: TEvaluation['questionType'],
    options: TEvaluation['options']
}

// Tipo para la respuesta esperada según el estándar
type EvaluationAPIResponse = {
    status: number;
    message: string;
    evaluation: TEvaluationLessonsAPIResponse;
};

export default async function EvaluationLessonsAPI({idCourse, idLesson}: EvaluationLessonsAPIProps): Promise<TEvaluationLessonsAPIResponse> {
    try {
        const id_course = idCourse;
        const id_lesson = idLesson;
        const response = await axios.get(`${COURSES_BASE_ENDPOINT}/${id_course}/lessons/${id_lesson}/evaluation`);
        console.log(response)

        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura de respuesta
        const responseData = response.data as EvaluationAPIResponse;
        if (!responseData.evaluation || typeof responseData.evaluation !== 'object') {
            throw new Error('Respuesta del servidor inválida: estructura de evaluación incorrecta');
        }
        console.log(responseData.evaluation)
        return responseData.evaluation;

    } catch (error) {
        console.error('Error en EvaluationLessons:', error);
        throw error;
    }
}
