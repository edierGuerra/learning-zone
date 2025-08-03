// Servicio que crea una evaluación para una lección específica de un curso
import axios from '../../../../api/axiosInstance';
import type { TCourse } from '../../../courses/types/CourseStudent';
import type { TEvaluationTeacherSend, TLessonTeacherResponse } from '../../types/Teacher';

const VITE_TEACHER_ENDPOINT = import.meta.env.VITE_TEACHER_ENDPOINT;

// Estructura esperada en la respuesta del backend
type TCreateEvaluationAPIResponse = {
  status: number;
  message: string;
};
type TCreateEvaluationAPIProps = {
  idCourse:TCourse['id'],
  idLesson:TLessonTeacherResponse['id'],
  evaluation:TEvaluationTeacherSend

};


/**
 * Crea una evaluación asociada a una lección dentro de un curso.
 * Valida que el backend responda correctamente.
 */
export async function CreateEvaluacionAPI({idCourse,idLesson,evaluation}:TCreateEvaluationAPIProps): Promise<TCreateEvaluationAPIResponse> {
  try {

    const response = await axios.post(
      `${VITE_TEACHER_ENDPOINT}/courses/${idCourse}/lessons/${idLesson}/evaluations`,
      {
        question_type:evaluation.question_type,
        question:evaluation.question,
        options: evaluation.options? evaluation.options: [],
        correct_answer:evaluation.correct_answer? evaluation.correct_answer: ''
      }
    );

    // Validar código HTTP
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
    }

    const responseData = response.data as TCreateEvaluationAPIResponse;

    return responseData;
  } catch (error) {
    console.error('Error al crear la evaluación:', error);
    throw error;
  }
}
