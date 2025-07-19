// src/components/comment.tsx
import { useState } from 'react';
import CommentForm from './commentForm';
import GenerateColorFromName from '../../../shared/Utils/GenerateColorFromName';
import type { TComment, TStudentAllComents } from './types';
import './styles/comment.css';

// Definimos la interfaz de propiedades que recibe el componente Comment.
// Esta interfaz extiende de CommentType e incluye algunas props adicionales.
interface CommentProps extends TComment {
  allComments: TComment[]; // Todos los comentarios (para filtrar respuestas)
  courseId: number;           // ID del curso al que pertenece este comentario
  allStudents: TStudentAllComents[]; // Lista de todos los estudiantes
}

// Componente principal para mostrar un comentario y sus posibles respuestas.
export default function Comment({
  nameStudent,
  text,
  timestamp,
  id,
  courseId,    
  allComments,
  allStudents,
  studentId     
}: CommentProps) {

  // Estado para mostrar u ocultar el formulario de respuesta
  const [showReplyForm, setShowReplyForm] = useState(false);
  //Estado para mostrar u ocultar la ventana con al informacion
  const [showWindowInformation, setShowWindowInformation] = useState(false)

  // Buscamos el estudiante en la lista para obtener su numIdentification
  const student = allStudents.find(s => s.id === studentId);
  const numIdentification = student?.numIdentification || 0;
  const prefixProfile = student?.prefixProfile || '';
  
  // Generamos el color basado en el nombre del estudiante y su número de identificación
  const avatarColor = GenerateColorFromName(nameStudent, numIdentification);

  // Filtramos los comentarios que tienen como parent_id el ID del comentario actual
  // Estos son las "respuestas" al comentario actual
  const replies = allComments.filter((c) => c.parentId === id);

  // Renderizado del componente
  return (
    <div className="comment">
      {/* Avatar con la inicial del usuario y color generado */}
      {showWindowInformation && (
        <div className="container-information-student">
          <button className="close-info-btn" onClick={() => setShowWindowInformation(false)}>✖</button>
          {student ? (
            <>
              <p className='prefix-window' style={{'backgroundColor':avatarColor}}>{student.prefixProfile}</p>
              <p>{student.name} {student.lastNames}</p>
              <p>{student.email}</p>
              <p> {student.stateConnect ? '🟢' : '🔴'}</p>
            </>
          ) : (
            <p>Información no disponible</p>
          )}
        </div>
      )}
      <div
        onClick={() => setShowWindowInformation(true)}
        className="avatar"
        style={{ backgroundColor: avatarColor, cursor: "pointer" }}
      >
        {prefixProfile}
      </div>

      {/* Cuerpo del comentario */}
      <div className="comment-body">

        {/* Metadatos: usuario y fecha */}
        <div className="meta">
          <span className="username">{nameStudent}</span>
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
              courseId={courseId}         // Curso actual
              allStudents={allStudents}   // Lista de todos los estudiantes
            />
          ))}
        </div>
      </div>
    </div>
  );
}

