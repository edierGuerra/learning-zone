import axios from '../../../api/axiosInstance';

export async function createEvaluation(lessonId: number, data: unknown) {
  const response = await axios.post(`/teacher/lessons/${lessonId}/evaluations`, data);
  return response.data;
}
