/* Servicio que solicitara al backend el contenido de una respectiva leccion */
import axios from '../../../api/axiosInstance';
import type { TContent, TCourse, TLesson } from '../types/Course';

const VITE_GETCOURSES_ENDPOINT = import.meta.env.VITE_GETCOURSES_ENDPOINT;

type ContentLessonsAPIProps = {
    idCourse :TCourse['id'],
    idLesson :TLesson['id']
}
export default async function ContentLessonsAPI({idCourse, idLesson}:ContentLessonsAPIProps):Promise<TContent> {
    try{
        const id_course = idCourse;
        const id_lesson = idLesson;
        const response = await axios.get(`${VITE_GETCOURSES_ENDPOINT}/${id_course}/lessons/${id_lesson}/content`)
        return response.data.content
      /*   return response.data. */

    }catch(error){
        console.error(error)
        throw error
    }
}

