/* Servicio que envia al backend la respuesta del usaurio y valida si es correcta o no */
import axios from '../../../api/axiosInstance';
import type { TCourse, TEvaluation, TLesson, TScore } from '../types/Course';
const VITE_GETCOURSES_ENDPOINT = import.meta.env.VITE_GETCOURSES_ENDPOINT;

type SendResponseLessonAPIProps ={
    id:TEvaluation['id'], /* id de la evaluacion */
    idCourse: TCourse['id'],
    idLesson: TLesson['id'],
    response:string,
    questionType:TEvaluation['questionType']
}

type SendResponseLessonAPIResponse ={
    status: number;
    message: string;
    score:{
        old_score:TScore['oldScore'],
        new_score:TScore['oldScore']
        date:TScore['date']
    }

}
export default async function SendResponseLessonAPI({id,idCourse,idLesson,response,questionType}:SendResponseLessonAPIProps):Promise<SendResponseLessonAPIResponse> {
    try{
        const id_course = idCourse;
        const id_lesson = idLesson;
        const id_evaluation =id; /* id de la evaluacion */
        const res = await axios.post(`${VITE_GETCOURSES_ENDPOINT}/${id_course}/lessons/${id_lesson}/evaluation/${id_evaluation}`,{
            question_type:questionType,
            response:response
        })
        if(res.status !== 400 && res.status !==200){
            throw new Error(`HTTP ${res.status}: ${res.data?.message || 'Error desconocido'}`);

        }
        return res.data


    }catch(error){
        console.error('Error en SendResponseLessonAPI:', error);
        throw error;

    }



}
