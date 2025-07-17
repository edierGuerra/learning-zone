// src/components/comment.tsx
import { useState } from 'react';
import CommentForm from './commentForm';
import type { TComment } from './types';

// Definimos la interfaz de propiedades que recibe el componente Comment.
// Esta interfaz extiende de CommentType e incluye algunas props adicionales.
interface CommentProps extends TComment {
  allComments: TComment[]; // Todos los comentarios (para filtrar respuestas)
  username: string;           // Nombre del usuario actual (el que está autenticado)
  courseId: number;           // ID del curso al que pertenece este comentario
}

// Componente principal para mostrar un comentario y sus posibles respuestas.
export default function Comment({
  user,
  text,
  timestamp,
  id,
  courseId,      // ✅ solo uno
  allComments,
  username     // ID del curso (se repite para el formulario de respuesta)
}: CommentProps) {

  // Estado para mostrar u ocultar el formulario de respuesta
  const [showReplyForm, setShowReplyForm] = useState(false);

  // Obtenemos la inicial del nombre del usuario, en mayúscula, para mostrar en el avatar
  const avatarInitial = user.charAt(0).toUpperCase();

  // Filtramos los comentarios que tienen como parent_id el ID del comentario actual
  // Estos son las "respuestas" al comentario actual
  const replies = allComments.filter((c) => c.parentId === id);

  // Renderizado del componente
  return (
    <div className="comment">
      {/* Avatar con la inicial del usuario */}
      <div className="avatar">{avatarInitial}</div>

      {/* Cuerpo del comentario */}
      <div className="comment-body">
        {/* Metadatos: usuario y fecha */}
        <div className="meta">
          <span className="username">{user}</span>
          <span className="time">{timestamp}</span>
        </div>

        {/* Texto del comentario */}
        <div className="text">{text}</div>

        {/* Botón para mostrar u ocultar el formulario de respuesta */}
        <button onClick={() => setShowReplyForm(!showReplyForm)}>
          {showReplyForm ? 'Cancelar' : 'Responder'}
        </button>

        {/* Formulario para enviar una respuesta (solo se muestra si showReplyForm es true) */}
        {showReplyForm && (
          <CommentForm
            username={username}         // Usuario que responde
            parentId={id}               // Este comentario es el padre
            courseId={courseId}         // Curso al que pertenece el comentario
            onReplySent={() => setShowReplyForm(false)} // Cierra el formulario al enviar
          />
        )}

        {/* Renderizado recursivo de las respuestas */}
        <div className="replies">
          {replies.map((reply) => (
            <Comment
              key={reply.id}              // Clave única para React
              {...reply}                  // Pasamos todas las propiedades del comentario hijo
              allComments={allComments}   // Lista completa para seguir la recursividad
              username={username}         // Usuario actual
              courseId={courseId}         // Curso actual
            />
          ))}
        </div>
      </div>
    </div>
  );
}

