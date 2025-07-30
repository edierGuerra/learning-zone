import type { TColorPalette } from "../../../shared/theme/ColorPalettesCourses";

export type TCourse = {
  id: number;
  name: string;
  description: string;
  image: string;
  colors: TColorPalette; // Paleta de colores del curso
category:
    | 'ofimatica'
    | 'electronica'
    | 'programacion'
    | 'diseno'
    | 'ciberseguridad'
    | 'desarrollo de videojuegos'
    | 'inteligencia artificial'
    | 'desarrollo web'
    | 'otro';
};

// Para estudiantes: seleccionamos solo las props necesarias
export type TCourseStudent = Pick<TCourse, "id" | "name" | "description" | "image" | 'category' |'colors'> & {
  status: "in_progress" | "completed";
};

// Para profesores: seleccionamos solo las props necesarias
export type TCourseTeacher = Pick<TCourse, 'id' | 'name' | 'description' | 'image' |'category' |'colors'> & {
  is_archive: boolean;
  is_published: boolean;
};

export type TCoursesTeachers = TCourseTeacher[];
export type TCoursesStudents = TCourseStudent[];
export type TCoursesGeneric = TCoursesTeachers | TCoursesStudents

/* Modelo de progreso de cada curso */

export type TProgressCourse  = {
    id_course: TCourse['id'],
    name_course:TCourse['name'],
    completed_lessons:number,
    all_lessons:number,
    status:TCourse['status']
};
export type TProgressCourses = TProgressCourse[]


/* Certifications */

export type TCertificatesStudent ={
    id: number,
    certificate_name: string,
    download_url: string,
}

// Modelo base de una lección
export interface TLesson {
    id: number;
    name: string;
    progressState: 'blocked' | 'in_progress' | 'complete';
    idCourse:TCourse['id']
}

export type TLessons = TLesson[];

export type TContent ={
    id:number,
    title: TLesson['name']
    contentType:'text'| 'image' | 'video' ,
    content:string,
    text: string
}
export type TEvaluation ={
    id:number,
    question:string,
    questionType:"open_question" | "multiple_choice",
    options?:string[] /* Es opcional */
}

export type TScore={
    oldScore: number,
    newScore:number,
    date:string


}
interface TStudentCourseContextType {
    courses:TCoursesStudents;
    lessons: TLessons;
    setLessons: React.Dispatch<React.SetStateAction<TLessons>>
    progress: number; // porcentaje
    content:TContent | null;
    currentLesson: TLesson | null;
    evaluation:TEvaluation | null,
    loadLessonsCourse:(idCourse: TCourse["id"]) => Promise<void>,
    loadLessonContent:(idCourse: TCourse["id"], lesson: TLesson) => Promise<void>,
    loadLessonEvaluation: (idCourse: TCourse["id"], idLesson: TLesson['id']) => Promise<void>,
    progressLessons: TProgressCourses,
    loadProgressLessons: () => Promise<void>,
    renderContent:(idCourse: TCourse["id"], lesson: TLesson)=> Promise<void>,
    renderEvaluation:(idCourse: TCourse["id"], idLesson: TLesson['id'])=> Promise<void>,
    palette:TColorPalette | null,
    setPalette: React.Dispatch<React.SetStateAction<TColorPalette | null>>,

}



