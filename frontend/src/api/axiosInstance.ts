// src/api/axiosInstance.ts
/* axiosInstance.ts define cómo se conecta tu frontend con el backend (baseURL, headers, tokens, etc.). */
import axios from "axios";
import { authStorage } from "../shared/Utils/authStorage"; // mejor que usar directamente localStorage

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos timeout para producción
});

/* Este es un interceptor: se ejecuta antes de cada petición.

Recupera el token guardado en localStorage. */
axiosInstance.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      authStorage.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
