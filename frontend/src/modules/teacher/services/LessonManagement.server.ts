import axios from '../../../api/axiosInstance';

export async function createLesson(courseId: number, data: unknown) {
  const response = await axios.post(`/teacher/courses/${courseId}/lessons`, data);
  return response.data;
}
