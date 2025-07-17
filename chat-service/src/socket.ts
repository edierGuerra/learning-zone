import { Server, Socket } from 'socket.io';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const registerSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('🟢 Usuario conectado');

    socket.on('join', async ({ name, courseId }) => {
      socket.data.username = name;
      try {
        const res = await axios.get(`${process.env.FASTAPI_URL}/comentarios?course_id=${courseId}`);
        socket.emit('commentList', res.data);
      } catch (err) {
        console.error('❌ Error obteniendo comentarios:', err);
      }
    });

    socket.on('newComment', async (comment) => {
      try {
        const res = await axios.post(`${process.env.FASTAPI_URL}/comentarios`, comment);
        if (res.status === 200) {
          io.emit('newComment', comment);
        }
      } catch (err) {
        console.error('❌ Error enviando comentario:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 Usuario desconectado');
    });
  });
};
