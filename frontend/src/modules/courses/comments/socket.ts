import  io  from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket'], // Fuerza WebSocket si polling falla
});

export default socket;

