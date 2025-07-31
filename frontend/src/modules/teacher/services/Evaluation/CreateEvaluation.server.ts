// Servicio que crea una evaluación para una lección específica de un curso
import axios from '../../../../api/axiosInstance';
import type { TEvaluationTeacherSend } from '../../types/Teacher';

const VITE_TEACHER_ENDPOINT = import.meta.env.VITE_TEACHER_ENDPOINT;

// Estructura esperada en la respuesta del backend
type TCreateEvaluationAPIResponse = {
  status: number;
  message: string;
};

/**
 * Crea una evaluación asociada a una lección dentro de un curso.
 * Valida que el backend responda correctamente.
 */
export async function CreateEvaluacionAPI(
  evaluation: TEvaluationTeacherSend & { idCourse: number; idLesson: number }
): Promise<TCreateEvaluationAPIResponse> {
  try {
    const { idCourse, idLesson, ...evaluationSend } = evaluation;

    const response = await axios.post(
      `${VITE_TEACHER_ENDPOINT}/courses/${idCourse}/lessons/${idLesson}/evaluations`,
      evaluationSend
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
