import  io , {Socket}  from 'socket.io-client';

let socket: typeof Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io('http://localhost:3001', {
      autoConnect: false,
      transports: ['websocket'],
      reconnectionAttempts: 2, // limita intentos
      reconnectionDelay: 3000,
    });

    // Log de conexión y errores
    socket.on('connect', () => console.log('✅ Socket conectado'));
    socket.on('connect_error', (err) => console.error('❌ Error de conexión:', err.message));
    socket.on('disconnect', (reason) => console.warn('⚠️ Desconectado:', reason));
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};
