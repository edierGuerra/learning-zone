import axios from '../../../api/axiosInstance';

export async function createNotification(data: unknown) {
  const response = await axios.post('/teacher/notifications', data);
  return response.data;
}
