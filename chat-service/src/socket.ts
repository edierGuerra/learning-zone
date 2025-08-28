// socket.ts
import { Server, Socket } from 'socket.io';
import axios from 'axios';
import http from 'http';
import dotenv from 'dotenv';
import { TComment, TCommentDelete, TCommentSend, TUpdateComment } from './types';

dotenv.config();

// Debug: Verificar variables de entorno
console.log("🔌 FastAPI URL:", process.env.FASTAPI_URL);
console.log("🔌 Chat Socket Path:", process.env.CHAT_SOCKET_PATH);

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

// Cliente Axios optimizado
const api = axios.create({
  baseURL: process.env.FASTAPI_URL,
  timeout: 5000,
  httpAgent: new http.Agent({
    keepAlive: true,
    maxSockets: 50,
  }),
});

// 🔧 Interceptor para debug de peticiones
api.interceptors.request.use(
  (config) => {
    console.log(`🔧 Making request to: ${config.baseURL}${config.url}`);
    // 🔧 DEBUG: Verificar headers de autorización
    const authHeader = config.headers?.Authorization;
    console.log(`🔧 Authorization header:`, authHeader ? `${String(authHeader).substring(0, 20)}...` : 'NO AUTH HEADER');
    return config;
  },
  (error) => {
    console.error('🔧 Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received from: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      `❌ Response error from ${error.config?.url}:`,
      error.message
    );
    // 🔧 DEBUG: Mostrar detalles del error 401
    if (error.response?.status === 401) {
      console.error('🔧 401 Error details:', error.response?.data);
    }
    return Promise.reject(error);
  }
);

// Funciones auxiliares para centralizar las llamadas
async function deleteCommentRequest(idComment: number, idCourse: number, token: string) {
  return api.delete<TNewCommentResponse>(
    `/api/v1/comments/${idComment}/delete/?id_course=${idCourse}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

async function updateCommentRequest(idComment: number, idCourse: number, text: string, token: string) {
  return api.put<TNewCommentResponse>(
    `/api/v1/comments/${idComment}/update/?id_course=${idCourse}`,
    { text }, // El backend espera "text", no "new_text"
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export const registerSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('🟢 Cliente conectado al socket');

    // Unirse al chat de un curso
    socket.on('join', async ({ name, courseId, token }) => {
      // 🔧 DEBUG: Verificar datos recibidos
      console.log("🔧 JOIN event received:");
      console.log("🔧 - name:", name);
      console.log("🔧 - courseId:", courseId);
      console.log(
        "🔧 - token:",
        token ? `${token.substring(0, 20)}...` : "NO TOKEN"
      );

      // 🔧 DEBUG: Decodificar token JWT para ver su contenido
      if (token) {
        try {
          const payload = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
          );
          console.log("🔧 Token payload:", {
            exp: payload.exp ? new Date(payload.exp * 1000) : "No expiry",
            iat: payload.iat ? new Date(payload.iat * 1000) : "No issued at",
            user_id: payload.user_id || payload.sub || "No user ID",
            email: payload.email || "No email",
          });

          // Verificar si el token ha expirado
          if (payload.exp && Date.now() >= payload.exp * 1000) {
            console.warn("⚠️ TOKEN EXPIRADO!");
          }
        } catch (e) {
          console.error("🔧 Error decodificando token:", e);
        }
      }

      if (!token || !courseId || !name) {
        console.warn(
          `⚠️ Conexión rechazada (datos incompletos) -> name:${name}, courseId:${courseId}, token:${!!token}`
        );
        return;
      }
      socket.data.username = name;

      try {
        const res = await api.get<TListComments>(
          `/api/v1/comments?course_id=${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data.list_ids_connects;
        io.emit("listStudentsConnects", data);

        const comments: TComment[] = res.data.comments.map((c) => ({
          id: c.id,
          courseId: c.course_id,
          nameStudent: c.name_student,
          parentId: c.parent_id,
          studentId: c.student_id,
          text: c.text,
          timestamp: c.timestamp,
        }));

        socket.emit("commentList", comments);
      } catch (err: any) {
        console.error(
          `❌ Error obteniendo comentarios para curso ${courseId}:`,
          err.message
        );
        console.error("🔧 Error status:", err.response?.status);
        console.error("🔧 Error data:", err.response?.data);
      }
    });

    // Nuevo comentario
    socket.on('newComment', async (newComment: TCommentSend) => {
      const { token, text, parentId, courseId } = newComment;
      
      // 🔧 DEBUG: Verificar datos del nuevo comentario
      console.log('🔧 NEW COMMENT event received:');
      console.log('🔧 - text:', text);
      console.log('🔧 - courseId:', courseId);
      console.log('🔧 - parentId:', parentId);
      console.log('🔧 - token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

      if (!token) {
        console.warn('⚠️ newComment: No token provided');
        socket.emit('commentError', { message: 'No tienes permisos para comentar' });
        return;
      }

      try {
        const res = await api.post<TNewCommentResponse>(
          '/api/v1/comments/',
          { text, parent_id: parentId, course_id: courseId },
          { headers: { Authorization: `Bearer ${token}` } }
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

        io.emit('newComment', comment);
        io.emit('listStudentsConnects', res.data.list_ids_connects);
        socket.emit('commentSuccess', { message: 'Comentario enviado exitosamente' });
      } catch (err: any) {
        console.error('❌ Error creating comment:', err.response?.data);
        socket.emit('commentError', {
          message: 'Error al enviar el comentario',
          details: err.response?.data?.detail || err.message
        });
      }
    });

    // Eliminar comentario
    socket.on('deleteComment', async (deleteData: TCommentDelete) => {
      const { token, idComment, idCourse } = deleteData;
      
      // 🔧 DEBUG: Verificar datos del delete
      console.log('🔧 DELETE COMMENT event received:');
      console.log('🔧 - idComment:', idComment);
      console.log('🔧 - idCourse:', idCourse);
      console.log('🔧 - token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

      if (!token) {
        console.warn('⚠️ deleteComment: No token provided');
        socket.emit('commentError', { message: 'No tienes permisos para comentar' });
        return;
      }

      try {
        const res = await deleteCommentRequest(idComment, idCourse, token);
        const comment: TComment = {
          id: res.data.comment.id,
          courseId: res.data.comment.course_id,
          parentId: res.data.comment.parent_id,
          nameStudent: res.data.comment.name_student,
          studentId: res.data.comment.student_id,
          timestamp: res.data.comment.timestamp,
          text: res.data.comment.text,
        };
        io.emit('commentUpdated', comment);
        io.emit('listStudentsConnects', res.data.list_ids_connects);
        socket.emit('commentSuccess', { message: 'Comentario eliminado exitosamente' });
      } catch (err: any) {
        console.error('❌ Error deleting comment:', err.response?.data);
        socket.emit('commentError', {
          message: 'Error al eliminar el comentario',
          details: err.response?.data?.detail || err.message
        });
      }
    });

    // Actualizar comentario
    socket.on('updateComment', async (updateData: TUpdateComment) => {
      const { token, idComment, idCourse, text } = updateData;
      
      // 🔧 DEBUG: Verificar datos del update
      console.log('🔧 UPDATE COMMENT event received:');
      console.log('🔧 - idComment:', idComment);
      console.log('🔧 - idCourse:', idCourse);
      console.log('🔧 - text:', text);
      console.log('🔧 - token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

      if (!token) {
        console.warn('⚠️ updateComment: No token provided');
        socket.emit('commentError', { message: 'No tienes permisos para comentar' });
        return;
      }

      try {
        const res = await updateCommentRequest(idComment, idCourse, text, token);

        const comment: TComment = {
          id: res.data.comment.id,
          courseId: res.data.comment.course_id,
          parentId: res.data.comment.parent_id,
          nameStudent: res.data.comment.name_student,
          studentId: res.data.comment.student_id,
          timestamp: res.data.comment.timestamp,
          text: res.data.comment.text,
        };

        io.emit('commentUpdated', comment);
        io.emit('listStudentsConnects', res.data.list_ids_connects);
        socket.emit('commentSuccess', { message: 'Comentario actualizado exitosamente' });
      } catch (err: any) {
        console.error('❌ Error updating comment:', err.response?.data);
        socket.emit('commentError', {
          message: 'Error al actualizar el comentario',
          details: err.response?.data?.detail || err.message
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 Cliente desconectado del socket');
    });
  });
};
