// types/Teacher.ts
import type { TCourse, TEvaluation, TLesson, TContent } from "../../courses/types/Course";

/* CURSO - Response del backend */
export type TCourseTeacherResponse = Pick<TCourse, 'id' | 'name' | 'description' | 'image' | 'category' | 'palette'> & {
  is_published: boolean;
};

/* CURSO - Envío al backend */
export type TCourseTeacherSend = Pick<TCourse, 'name' | 'description' | 'category' | 'image' | 'palette'>;

/* LECCIÓN - Response */
export type TLessonTeacherResponse = {
  id: TLesson['id'];
  name: TLesson['name'];
  content: {
    contentType: TContent['contentType'];
    content: TContent['content'];
    text: TContent['text'];
  };
};
export type TLessonsTeacherResponse = TLessonTeacherResponse[];

/* LECCIÓN - Envío */
export type TLessonTeacherSend = {
  idCourse:TCourse['id'],
  name: string;
  content: {
    contentType: TContent['contentType'];
    text: string;
    file: File | null;
  };
};

/* EVALUACIÓN - Response */
export type TEvaluationTeacherResponse = {
  id: TEvaluation['id'];
  questionType: TEvaluation['questionType'];
  question: TEvaluation['question'];
  options: TEvaluation['options'];
};

/* EVALUACIÓN - Envío */
export type TEvaluationTeacherSend = {
  idCourse:TCourse['id'],
  idLesson :TLesson['id'],
  questionType: TEvaluation['questionType'];
  question: TEvaluation['question'];
  options: TEvaluation['options'];
  correctAnswer?: string;
};

/* Cursos múltiples */
export type TCoursesTeachers = TCourseTeacherResponse[];

/* Formulario completo */
export type TFormDataLesson = {
  lesson: TLessonTeacherSend;
  evaluation: TEvaluationTeacherSend;
};
