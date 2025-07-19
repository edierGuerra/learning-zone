import { useEffect, useState,  useMemo } from 'react';
import { getSocket } from './socket';             // YA NO default
import Comment from './comment';
import CommentForm from './commentForm';
import UserList from './userList';
import type { TComment, TStudentAllComents } from './types';
import '../comments/styles/commentPage.css';
import { authStorage } from '../../../shared/Utils/authStorage';
import type { TStudent } from '../../types/User';
import toast from 'react-hot-toast';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import { useNavigationHandler } from '../../../hooks/useNavigationHandler';

interface CommentPageProps {
  courseId: number;
  nameCourse: string;
}

export default function CommentPage({ courseId, nameCourse }: CommentPageProps) {
  const [comments, setComments] = useState<TComment[]>([]);
  const [allStudents, setAllStudents] = useState<TStudentAllComents[]>([]);
  const [listStudentsConnects, setListStudentsConnects] = useState<TStudent['id'][]>([]);
/*   const prevConnectedIds = useRef<TStudent['id'][]>([]); */
  const student = useMemo(() => authStorage.getUser(), []);
  const socket = getSocket();  // Usamos la instancia compartida

    const handleBtnNavigate = useNavigationHandler()


  useEffect(() => {
    const allstudentsStorage = authStorage.getAllStudents();
    setAllStudents(allstudentsStorage || []);

    socket.emit('join', {
      name: student?.name,
      courseId,
      token: authStorage.getToken(),
    });

    socket.on('commentList', (comments: TComment[]) => {
      setComments(comments);
    });

    socket.on('listStudentsConnects', (data: TStudent['id'][] | []) => {
      setListStudentsConnects(data);
    });

    socket.on('newComment', (comment: TComment) => {
      if (comment.courseId === courseId) {
        setComments(prev => [...prev, comment]);
        if (comment.nameStudent === student?.name) {
          toast.success('¡Tu comentario fue enviado y ya es visible para todos!');
        }
      }
    });

    return () => {
      socket.off('commentList');
      socket.off('newComment');
      socket.off('listStudentsConnects');
    };
  }, [student?.name, courseId]);

  useEffect(() => {
    if (allStudents.length === 0 || !Array.isArray(listStudentsConnects)) return;
    setAllStudents(prev =>
      prev.map(student => ({
        ...student,
        stateConnect: listStudentsConnects.includes(student.id),
      }))
    );
  }, [listStudentsConnects]);



  return (
    <div className={`comment-page ${nameCourse.toLowerCase()}`}>
      <button className="btn-back-comment" onClick={()=>handleBtnNavigate('/back')}>{<IoArrowBackCircleSharp/>}</button>

      <div className="left">
        <h2 className='title-comment'>Comentarios {nameCourse}</h2>
        <div className={`comments ${nameCourse.toLowerCase()}`}>
          {comments
            .filter(c => c.parentId === null)
            .map(c => (
              <Comment
                key={c.id}
                {...c}
                allComments={comments}
                courseId={courseId}
                allStudents={allStudents}
              />
            ))}
        </div>
        <CommentForm courseId={courseId} />
      </div>
      <div className={`right ${nameCourse.toLowerCase()}`}>
        <UserList students={allStudents} />
      </div>
    </div>
  );
}
