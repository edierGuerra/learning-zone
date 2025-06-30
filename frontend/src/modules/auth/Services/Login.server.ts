/* const API_URL = import.meta.url.VITE_API_URL;
const LOGIN_ENDPOINT = import.meta.env.VITE_AUTH_ENDPOINT; */

import axios from "../../../api/axiosInstance";

import type { TStudent } from '../../types/User';

const API_URL = import.meta.env.VITE_API_URL;

export const loginAPI = (email: TStudent['email'], password: TStudent['password']) => {
  return axios.post(`${API_URL}/login`, { email, password });
};
