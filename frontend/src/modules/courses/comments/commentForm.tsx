// src/components/commentForm.tsx
import { useState } from 'react';
import { connectSocket } from './socket';  // Usamos la función en vez de default
import { authStorage } from '../../../shared/Utils/authStorage';
import type { TCommentSend } from './types';
import './styles/commentForm.css';

interface CommentFormProps {
  parentId?: number | null;
  courseId: number;
  onReplySent?: () => void;
}

export default function CommentForm({
  parentId = null,
  courseId,
  onReplySent
}: CommentFormProps) {
  const [text, setText] = useState('');
  const socket = connectSocket(); // Se conecta solo si no lo está

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const token = authStorage.getToken();
    if (!token) {
      console.warn("No hay token, no se puede enviar comentario");
      return;
    }

    const newComment: TCommentSend = {
      text,
      parentId,
      courseId,
      token
    };

    console.log("Enviando comentario:", newComment);
    socket.emit('newComment', newComment);  // Enviar al servidor
    setText('');
    onReplySent?.();
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        className="input"
        placeholder="Escribe tu comentario..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
