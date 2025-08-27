// src/api/chatInstance.ts
/* Configuración para conectar con el chat service */
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  // Configuración dinámica basada en entorno
  const isProduction = import.meta.env.PROD;
  const isDevelopment = import.meta.env.DEV;
  
  let chatUrl: string;
  
  if (import.meta.env.VITE_CHAT_URL) {
    // Si se define explícitamente en variables de entorno
    chatUrl = import.meta.env.VITE_CHAT_URL;
  } else if (isProduction) {
    // CAMBIO: Usar el dominio principal, no el subdirectorio
    chatUrl = "https://cjetechnology.org";
  } else if (isDevelopment) {
    // En desarrollo, usar proxy local de nginx
    chatUrl = "/";
  } else {
    // Fallback
    chatUrl = "https://cjetechnology.org";
  }
  
  console.log('🔌 Connecting to chat service:', chatUrl);
  
  socket = io(chatUrl, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    forceNew: true,
    transports: ['websocket', 'polling'], // Asegurar compatibilidad
  });

  socket.on('connect', () => {
    console.log('✅ Connected to chat service');
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected from chat service:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Chat connection error:', error);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
};
