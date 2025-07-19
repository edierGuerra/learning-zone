/* Serivicio que se encarga de obtener los cursos del estudiante */

import axios from '../../../api/axiosInstance';
import type {TCourses } from '../types/Course';
const VITE_GETCOURSES_ENDPOINT = import.meta.env.VITE_GETCOURSES_ENDPOINT;

export default async function GetCoursesAPI():Promise<TCourses> {
    try{

        const response = await axios.get(VITE_GETCOURSES_ENDPOINT)
        return response.data.data

    }catch(error){
        console.error('Error en GetCourses')
        throw error

    }
}
