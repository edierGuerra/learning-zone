import axios from '../../../api/axiosInstance';
import type { TTeacherProfileToken } from '../../types/User';

export async function teacherLogin(email: string, password: string): Promise<TTeacherProfileToken> {
  const response = await axios.post('/teacher/login', { email, password });
  return response.data as TTeacherProfileToken;
}
