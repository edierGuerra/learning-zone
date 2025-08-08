import type { AxiosResponse } from 'axios';
import axios from '../../../../api/axiosInstance';
import type { TCourseTeacherResponse } from '../../types/Teacher';

const VITE_TEACHER_ENDPOINT = import.meta.env.VITE_TEACHER_ENDPOINT;

type TDeleteCourseAPIResponse = {
  status: number;
  message: string;
};

export default async function DeleteCourseAPI(
  courseId: TCourseTeacherResponse['id']
): Promise<TDeleteCourseAPIResponse> {
  try {
    const response: AxiosResponse<TDeleteCourseAPIResponse> = await axios.delete(
      `${VITE_TEACHER_ENDPOINT}/courses/${courseId}`
    );

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.data.message || 'Error al eliminar el curso'}`);
    }

    return {
      status: response.data.status,
      message: response.data.message,
    };
  } catch (error) {
    console.error(`❌ Error eliminando el curso con ID ${courseId}:`, error);
    throw error;
  }
}
