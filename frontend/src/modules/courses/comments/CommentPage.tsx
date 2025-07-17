// src/pages/CommentPage.tsx

import { useEffect, useState } from 'react';
import socket from './socket';                
import Comment from './comment';              
import CommentForm from './commentForm';     
import UserList from './userList';          
import type { TComment,  TStudentAllComents } from './types';  
import '../components/styles/commentPage.css';
import { authStorage } from '../../../shared/Utils/authStorage';
import type { TStudent } from '../../types/User';

// Props que recibe el componente CommentPage
interface CommentPageProps {
  courseId: number;     // ID del curso actual (para filtrar comentarios)
  nameCourse: string;
}


// Componente principal que renderiza la página de comentarios
export default  function CommentPage({ courseId, nameCourse }: CommentPageProps) {
  const [comments, setComments] = useState<TComment[]>([]); // Lista de comentarios del curso
  const [allStudents, setAllStudents] = useState<TStudentAllComents[]>([]);
  const [listStudentsConnects, setListStudentsConnects] = useState<TStudent['id'][]>([]);


  // Obtenemos el nombre de usuario desde localStorage o usamos un valor por defecto
  const student = authStorage.getUser();
  // useEffect que se ejecuta al montar el componente (y cuando username o courseId cambian)
  useEffect(() => {
    const allstudentsStorage=authStorage.getAllStudents();
    setAllStudents(allstudentsStorage!)
    // Enviamos al servidor que nos unimos al curso con nuestro nombre
    socket.emit('join', {name:student!.name, courseId });

    // Escuchamos la lista completa de comentarios enviada por el servidor
    socket.on('commentList', (data: TComment[]) => {
      setComments(data); // Guardamos los comentarios en el estado
    });
    // Escuchamos la lista de id de usuarios conectados
    socket.on('listStudentsConnects', (data: TStudent['id'][]) => {
      setListStudentsConnects(data); // Guardamos los ids de los estudiantes conectados en el estado
    });

    // Escuchamos cuando se recibe un nuevo comentario
    socket.on('newComment', (comment: TComment) => {
      // Solo lo añadimos si pertenece al mismo curso
      if (comment.courseId === courseId) {
        setComments(prev => [...prev, comment]); // Añadimos el nuevo comentario al final de la lista
        /* Llamar funcion que trae todos los usuarios (getAllStudents) */
      }
    });
    // Escuchamos actualizaciones de la lista de usuarios conectados
    // Limpiamos los listeners cuando se desmonta el componente o cambian las dependencias
    return () => {
      socket.off('commentList');
      socket.off('newComment');
      socket.off('listStudentsConnects');
    };
  }, [student, courseId]); // Dependencias: se ejecuta si cambia el nombre de usuario o el ID del curso
  
  useEffect(() => {
    if (allStudents.length === 0) return; // Evita ejecución prematura

    const updated = allStudents.map((student) => ({
      ...student,
      stateConnect: listStudentsConnects.includes(student.id),
    }));
    setAllStudents(updated);
  }, [listStudentsConnects, allStudents]);



  // Renderizamos la interfaz de comentarios
  return (
    <div className="comment-page">
      {/* Sección izquierda: Comentarios y formulario */}
      <div className="left">
        <h2>Comentarios {nameCourse}</h2>

        {/* Renderizamos solo los comentarios principales (parent_id === null) */}
        <div className={`comments ${nameCourse.toLowerCase()}`}>
          {comments
            .filter((c) => c.parentId === null)  // Esto sí son los comentarios raíz 
            .map((c) => (
              <Comment
                key={c.id}
                {...c}                           // Pasamos todas las props del comentario
                allComments={comments}          // Pasamos todos los comentarios para renderizar respuestas
                username={student!.name}             // Pasamos el nombre de usuario
                courseId={courseId}             // ID del curso actual
              />
            ))}
        </div>

        {/* Formulario para crear nuevo comentario (no respuesta) */}
        <CommentForm username={student!.name} courseId={courseId} />
      </div>

      {/* Sección derecha: Lista de usuarios */}
      <div className={`right ${nameCourse.toLowerCase()}`}>
        <UserList students={allStudents} />
      </div>
    </div>
  );
}
