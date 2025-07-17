import type { TStudent } from "../../types/User";

// src/components/types.ts
export type TComment ={
  id: number;
  user: string;
  text: string;
  timestamp: string;
  parentId: number | null;
  courseId: number;
}

export type TStudentAllComents ={
    id: TStudent['id'];
    numIdentification: TStudent['numIdentification'];
    name: TStudent['name'];
    lastNames: TStudent['lastNames'];
    email: TStudent['email'];
    prefixProfile: string; // Campo útil para mostrar iniciales, títulos o avatar textual
    stateConnect: boolean
};
  