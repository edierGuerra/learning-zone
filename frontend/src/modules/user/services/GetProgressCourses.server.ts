/* Serivicio que se encarga de obtener el progreso del estudiante del estudiante */

import axios from '../../../api/axiosInstance';
import type { TProgressCourses } from '../../courses/types/Course';
const VITE_GETCOURSES_ENDPOINT = import.meta.env.VITE_GETCOURSES_ENDPOINT;

export default async function ProgressCoursesAPI():Promise<TProgressCourses> { /* Cambiar esto por el type correspondiente */
    try{

        const response = await axios.get(`${VITE_GETCOURSES_ENDPOINT}/lessons`)
        console.log(response.data)
        return response.data

    }catch(error){
        console.error('Error en GetCourses')
        throw error

    }
}
