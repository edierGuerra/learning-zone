/* const API_URL = import.meta.url.VITE_API_URL;
const LOGIN_ENDPOINT = import.meta.env.VITE_AUTH_ENDPOINT; */

import axios from 'axios'
import type { TUser } from '../../types/User';

const API_URL = import.meta.env.VITE_API_URL;

export const loginAPI = (email: TUser['email'], password: TUser['password']) => {
  return axios.post(`${API_URL}/login`, { email, password });
};
