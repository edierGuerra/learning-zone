// src/components/commentForm.tsx
import { useState } from 'react';         
import socket from './socket';            

// Definimos las propiedades que recibe el componente CommentForm
interface CommentFormProps {
  username: string;                        // Nombre del usuario que comenta
  parentId?: number | null;                // ID del comentario padre (si es una respuesta); null si es un comentario principal
  courseId: number;                        // ID del curso al que pertenece el comentario
  onReplySent?: () => void;               // Función opcional que se llama cuando se envía una respuesta (para cerrar el formulario, por ejemplo)
}

// Definimos el componente funcional CommentForm
export default function CommentForm({
  username,
  parentId = null,                       
  courseId,
  onReplySent
}: CommentFormProps) {
  const [text, setText] = useState('');    // Estado local para guardar el contenido del comentario

  // Función que maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();                    // Prevenimos el comportamiento por defecto del formulario (recargar la página)
    if (!text.trim()) return;              // Si el campo está vacío o solo tiene espacios, no se envía

    // Creamos el nuevo comentario como objeto
    const newComment = {
      user: username,                      // Usuario que comenta
      text,                                // Texto del comentario
      timestamp: new Date().toISOString(),// Fecha y hora actual en formato ISO
      parent_id: parentId,                 // ID del comentario padre (o null si es principal)
      course_id: courseId,                 // ID del curso al que pertenece
    };

    console.log(" Enviando comentario:", newComment); // Mostramos en consola el comentario antes de enviarlo

    socket.emit('newComment', newComment); // Emitimos el evento 'newComment' al servidor con el nuevo comentario
    setText('');                            // Limpiamos el campo de texto después de enviarlo
    onReplySent?.();                     // Si hay una función de respuesta, la ejecutamos (opcional)
  };

  // Retornamos el formulario para escribir el comentario
  return (
    <form onSubmit={handleSubmit} className="comment-form"> {/* Formulario con el manejador handleSubmit */}
      <textarea
        className="input"                  // Clase CSS para estilos del campo
        placeholder="Escribe tu comentario..." // Texto guía dentro del campo
        value={text}                       // El valor del textarea está ligado al estado text
        onChange={(e) => setText(e.target.value)} // Actualizamos el estado cuando el usuario escribe
      />
      <button type="submit">Enviar</button> {/* Botón para enviar el comentario */}
    </form>
  );
}
