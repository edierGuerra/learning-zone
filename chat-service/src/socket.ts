import { Server, Socket } from 'socket.io';
import axios from 'axios';
import dotenv from 'dotenv';
import { TComment, TCommentSend } from './types';

dotenv.config();
type TCommentResponse ={
  id: TComment['id'],
  name_student: TComment['nameStudent'],
  student_id:TComment['studentId'],
  course_id: TComment['courseId'],
  parent_id:TComment['parentId']
  text:TComment['text'],
  timestamp:TComment['timestamp']
}
type TNewCommentResponse = {
  comment: TCommentResponse;
  listIdsConnects: number[];
};

export const registerSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('🟢 Usuario conectado');

    socket.on('join', async ({ name, courseId }) => {
      socket.data.username = name;
      try {
        const res = await axios.get(`${process.env.FASTAPI_URL}/comments?course_id=${courseId}`);
        socket.emit('commentList', res.data.comments);
      } catch (err) {
        console.error('❌ Error obteniendo comentarios:', err);
      }
    });

    socket.on('newComment', async (comment: TCommentSend) => {
      const token = comment.token;

      // Validación básica del token
      if (!token) {
        console.warn('⚠️ Token no proporcionado. Comentario rechazado.');
        return;
      }

      const commentSend = {
        text: comment.text,
        timestamp: comment.timestamp,
        parent_id: comment.parentId,
        course_id: comment.courseId,
      };

      try {
        const res = await axios.post<TNewCommentResponse>(
          `${process.env.FASTAPI_URL}/comments`,
          commentSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          const newComment:TComment ={
            id:res.data.comment.id,
            courseId:res.data.comment.course_id,
            parentId:res.data.comment.parent_id,
            nameStudent:res.data.comment.name_student,
            studentId:res.data.comment.student_id,
            timestamp:res.data.comment.timestamp,
            text:res.data.comment.text
          }
          io.emit('newComment', newComment);
          io.emit('listStudentsConnects', res.data.listIdsConnects);
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
