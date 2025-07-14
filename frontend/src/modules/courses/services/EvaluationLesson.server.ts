/* Servicio que solicita al backend la evaluacion de una respectiva leccion */
import axios from '../../../api/axiosInstance';
import type {TCourse, TEvaluation, TLesson } from '../types/Course';

const VITE_GETCOURSES_ENDPOINT = import.meta.env.VITE_GETCOURSES_ENDPOINT;

type EvaluationLessonsAPIProps = {
    idCourse :TCourse['id'],
    idLesson :TLesson['id']
}
export default async function EvaluationLessonsAPI({idCourse, idLesson}:EvaluationLessonsAPIProps):Promise<TEvaluation> {
    try{
        const id_course = idCourse;
        const id_lesson = idLesson;
        const response = await axios.get(`${VITE_GETCOURSES_ENDPOINT}/${id_course}/lessons/${id_lesson}/evaluation`)
        return response.data.evaluation
      /*   return response.data. */

    }catch(error){
        console.error(error)
        throw error
    }
}

