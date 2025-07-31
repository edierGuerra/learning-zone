import axios from '../../../api/axiosInstance';

export async function getTeacherCourses() {
  const response = await axios.get('/teacher/courses');
  return response.data;
}
