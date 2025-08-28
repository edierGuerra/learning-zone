// src/api/axiosInstance.ts
/* axiosInstance.ts define cómo se conecta tu frontend con el backend (baseURL, headers, tokens, etc.). */
import axios from "axios";
import { authStorage } from "../shared/Utils/authStorage"; // mejor que usar directamente localStorage

/**
 * Función robusta para forzar HTTPS en cualquier URL
 * Esta es la función clave para prevenir Mixed Content errors
 */
function forceHTTPS(url: string): string {
  if (!url) return url;
  
  // Primero reemplazamos cualquier ocurrencia de http:// con https://
  let secureUrl = url.replace(/^http:\/\//i, 'https://');
  
  // Si la URL es relativa (no comienza con https://) pero incluye el dominio, 
  // aseguramos que use https://
  if (!secureUrl.startsWith('https://') && secureUrl.includes('cjetechnology.org')) {
    secureUrl = `https://${secureUrl.replace(/^[^:]+:\/\//, '')}`;
  }
  
  // Debug para verificar la transformación
  if (url !== secureUrl) {
    console.log(`🔒 URL convertida de '${url}' a '${secureUrl}'`);
  }
  
  return secureUrl;
}

const baseURL = import.meta.env.VITE_API_URL || "https://cjetechnology.org/backend";
// Forzar HTTPS en producción para evitar Mixed Content
const secureBaseURL = forceHTTPS(baseURL);
console.log("🔧 axiosInstance MODE:", import.meta.env.MODE);
console.log("🔧 axiosInstance VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("🔧 axiosInstance baseURL original:", baseURL);
console.log("🔧 axiosInstance baseURL final:", secureBaseURL);

const axiosInstance = axios.create({
  baseURL: secureBaseURL,
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
// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - pero NO redireccionamos automáticamente
      // para evitar ciclos infinitos durante la autenticación
      console.log("❌ Error 401: Token inválido o expirado");
      authStorage.removeToken();
      // Solo redirigimos si no estamos ya en la página de login o registro
      const currentPath = window.location.pathname;
      if (!['/login', '/register', '/'].includes(currentPath)) {
        console.log("🔄 Redirigiendo a login por token inválido");
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Interceptor específico para verificar todas las URLs antes de enviar
axios.interceptors.request.use((config) => {
  // Extra check global para cualquier request de axios (no solo axiosInstance)
  const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
  if (fullUrl && fullUrl.includes('http:')) {
    console.warn(`⚠️ Detectada URL HTTP: ${fullUrl}`);
    const secureFullUrl = forceHTTPS(fullUrl);
    if (config.baseURL) {
      config.baseURL = '';
      config.url = secureFullUrl;
    } else if (config.url) {
      config.url = secureFullUrl;
    }
  }
  return config;
});

export default axiosInstance;