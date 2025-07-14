/* Servicio que se conecta al backend para solicitar las lecciones de un cursos de un estudiante  */
import axios from '../../../api/axiosInstance';
import type {TCourse,TLessons } from '../types/Course';
const VITE_GETCOURSES_ENDPOINT = import.meta.env.VITE_GETCOURSES_ENDPOINT;

export default async function LessonsCourseAPI(idCourse:TCourse['id']):Promise<TLessons> {
    try{
        const id_course = idCourse
        alert(id_course)
        const response = await axios.get(`${VITE_GETCOURSES_ENDPOINT}/${id_course}/lessons`)
        console.log(response.data.lessons)
        return response.data.lessons
    /*     return response.data */

    }catch(error){
        console.error('Error en Get lessons')
        throw error

    }
}
