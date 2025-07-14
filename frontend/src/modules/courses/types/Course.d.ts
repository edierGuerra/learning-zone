export type TCourse ={
    id:int,
    name:string,
    description:string
}
export type TCourses = TCourse[];

/* Modelo de progreso de cada curso */

export type TProgressCourse  = {
    id_course: TCourse['id'],
    name_course:TCourse['name'],
    completed_lessons:number,
    all_lessons:number
};
export type TProgressCourses = TProgressCourse[]

// Modelo base de una lección
export interface TLesson {
    id: number;
    name: string;
    description: string;
    progress_state: 'blocked' | 'in_progress' | 'complete';
}

export type TLessons = TLesson[];

export type TContent ={
    id:number,
    contentType:'text'| 'image' | 'video' ,
    content:string
}
export type TEvaluation ={
    id:number,
    question:string,
    questionType:string,
    options?:string /* Es opcional */
}
interface TCourseContextType {
    courses:TCourses;
    lessons: TLessons;
    setLessons: React.Dispatch<React.SetStateAction<TLessons>>
    progress: number; // porcentaje
    currentLesson: Lesson | null;
    content:TContent | null;
    evaluation:TEvaluation | null,
    loadLessonsCourse:(idCourse: TCourse["id"]) => Promise<void>,
    loadLessonContent:(idCourse: TCourse["id"], lesson: TLesson) => Promise<void>,
    loadLessonEvaluation: (idCourse: TCourse["id"], lesson: TLesson) => Promise<void>,
    progressLessons: TProgressCourses,
    loadProgressLessons: () => Promise<void>;

}



