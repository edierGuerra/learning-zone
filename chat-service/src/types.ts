export type TComment = {
  id: number;
  nameStudent: string;
  text: string;
  timestamp: string;
  parentId: number | null;
  courseId: number;
  studentId: number;
}

// Comentario que se envía al servidor, incluye el token pero no requiere el ID todavía
export type TCommentSend = Omit<TComment, 'id' | 'studentId'> & {
  token: string;
};
export type TIStudentsConnect ={
    id:number
}

