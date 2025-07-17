import type { TStudent } from "../../types/User";
// types.tsx
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


export type TStudentAllComents ={
    id: TStudent['id'];
    numIdentification: TStudent['numIdentification'];
    name: TStudent['name'];
    lastNames: TStudent['lastNames'];
    email: TStudent['email'];
    prefixProfile: string; // Campo útil para mostrar iniciales, títulos o avatar textual
    stateConnect: boolean
};
  