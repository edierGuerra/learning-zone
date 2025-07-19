// socket.ts
import { Server, Socket } from 'socket.io';
import axios from 'axios';
import http from 'http';
import dotenv from 'dotenv';
import { TComment, TCommentSend } from './types';

dotenv.config();

type TCommentResponse = {
  id: TComment['id'];
  name_student: TComment['nameStudent'];
  student_id: TComment['studentId'];
  course_id: TComment['courseId'];
  parent_id: TComment['parentId'];
  text: TComment['text'];
  timestamp: TComment['timestamp'];
};

type TListComments = {
  comments: TCommentResponse[] | [];
  list_ids_connects: number[] | [];

};

type TNewCommentResponse = {
  comment: TCommentResponse;
  list_ids_connects: number[];
};

// Cliente Axios optimizado (evita abrir demasiadas conexiones)
const api = axios.create({
  baseURL: process.env.FASTAPI_URL,
  timeout: 5000,
  httpAgent: new http.Agent({
    keepAlive: true,
    maxSockets: 50,
  }),
});

export const registerSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('🟢 Cliente conectado al socket');

    // Evento cuando un usuario entra al chat de un curso
    socket.on('join', async ({ name, courseId, token }) => {
      if (!token || !courseId || !name) {
        console.warn(`⚠️ Conexión rechazada (datos incompletos) -> name:${name}, courseId:${courseId}`);
        return;
      }

      socket.data.username = name;

      try {
        const  res = await api.get<TListComments>(`/api/v1/comments?course_id=${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.list_ids_connects
        io.emit('listStudentsConnects', data);

        if(res.data.comments.length >0){
          const comments: TComment[] = res.data.comments.map((c) => ({
            id: c.id,
            courseId: c.course_id,
            nameStudent: c.name_student,
            parentId: c.parent_id,
            studentId: c.student_id,
            text: c.text,
            timestamp: c.timestamp,
          }));
          socket.emit('commentList', comments);
          io.emit('listStudentsConnects', res.data.list_ids_connects);

          
        }else {
          const comments: TComment[] = [];
          socket.emit('commentList', comments);
        }


      } catch (err: any) {
        console.error(`❌ Error obteniendo comentarios para curso ${courseId}:`, err.message);
      }
    });

    // Cuando llega un nuevo comentario
    socket.on('newComment', async (newComment: TCommentSend) => {
      const token = newComment.token;
      if (!token) {
        console.warn('⚠️ Comentario rechazado: sin token.');
        socket.emit('commentError', { message: 'No tienes permisos para comentar' });
        return;
      }

      try {
        const res = await api.post<TNewCommentResponse>(
          '/api/v1/comments',
          {
            text: newComment.text,
            parent_id: newComment.parentId,
            course_id: newComment.courseId,
            // timestamp se genera en el backend
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const comment: TComment = {
          id: res.data.comment.id,
          courseId: res.data.comment.course_id,
          parentId: res.data.comment.parent_id,
          nameStudent: res.data.comment.name_student,
          studentId: res.data.comment.student_id,
          timestamp: res.data.comment.timestamp,
          text: res.data.comment.text,
        };
        const data = res.data.list_ids_connects;
        io.emit('listStudentsConnects', data);
        io.emit('newComment', comment);
        
        // Enviar confirmación al usuario que envió el comentario
        socket.emit('commentSuccess', { message: 'Comentario enviado exitosamente' });
        
      } catch (err: any) {
        console.error('❌ Error enviando comentario:', err.message);
        // Enviar error al cliente
        socket.emit('commentError', { 
          message: 'Error al enviar el comentario',
          details: err.response?.data?.detail || err.message 
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 Cliente desconectado del socket');
    });
  });
};
