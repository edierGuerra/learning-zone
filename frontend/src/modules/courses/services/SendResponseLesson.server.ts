/* Servicio que envía al backend la respuesta del usuario y valida si es correcta o no */
import axios from '../../../api/axiosInstance';
import type { TCourse, TEvaluation, TLessonStudent, TScore } from '../types/CourseStudent';

const VITE_GETCOURSES_ENDPOINT = import.meta.env.VITE_GETCOURSES_ENDPOINT;

type SendResponseLessonAPIProps = {
  id: TEvaluation['id'];            // id de la evaluación
  idCourse: TCourse['id'];
  idLesson: TLessonStudent['id'];
  response: string;
  questionType: TEvaluation['questionType'];
};

type SendResponseLessonAPIResponse = {
  status: number;
  message: string;
  score?: {
    old_score: TScore['oldScore'];
    new_score: TScore['newScore'];
    date: TScore['date'];
  };
};

export default async function SendResponseLessonAPI({
  id,
  idCourse,
  idLesson,
  response,
  questionType,
}: SendResponseLessonAPIProps): Promise<SendResponseLessonAPIResponse> {
  const id_course = idCourse;
  const id_lesson = idLesson;
  const id_evaluation = id;

  const res = await axios.post(
    `${VITE_GETCOURSES_ENDPOINT}/${id_course}/lessons/${id_lesson}/evaluation/${id_evaluation}`,
    {
      question_type: questionType,
      response,
    },
    {
      // Permite que 400 pase como respuesta normal (sin throw)
      validateStatus: (status) => status < 500,
    }
  );

  return res.data;

}
