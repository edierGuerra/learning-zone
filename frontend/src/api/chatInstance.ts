// src/api/chatInstance.ts
/* Configuración para conectar con el chat service */
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  const chatUrl = import.meta.env.VITE_CHAT_URL || 'http://localhost:3001';
  
  socket = io(chatUrl, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
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
