// src/api/axiosInstance.ts
/* axiosInstance.ts define cómo se conecta tu frontend con el backend (baseURL, headers, tokens, etc.). */
import axios from "axios";
import { authStorage } from "../shared/Utils/authStorage"; // mejor que usar directamente localStorage

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL /* || "http://localhost:8000/api" */,
  headers: {
    "Content-Type": "application/json",
  },
});

/* Este es un interceptor: se ejecuta antes de cada petición.

Recupera el token guardado en localStorage. */
axiosInstance.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
