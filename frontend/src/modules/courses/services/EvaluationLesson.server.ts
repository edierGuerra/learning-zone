/* Servicio que solicita al backend la evaluacion de una respectiva leccion */
import axios from '../../../api/axiosInstance';
import type {TCourse, TEvaluation, TLesson } from '../types/Course';

const VITE_GETCOURSES_ENDPOINT = import.meta.env.VITE_GETCOURSES_ENDPOINT;
/* Agregar en response un atributo score que es el puntaje */
type EvaluationLessonsAPIProps = {
    idCourse: TCourse['id'],
    idLesson: TLesson['id']
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
        const response = await axios.get(`${VITE_GETCOURSES_ENDPOINT}/${id_course}/lessons/${id_lesson}/evaluation`);
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
