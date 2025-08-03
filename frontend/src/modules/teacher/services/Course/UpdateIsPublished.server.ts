/* Servicio encargado de cambiar el estado publicado / no publicado */
/* Servicio para crear un curso */
/* Servicio encargado de crear una leccion */

/* Servicio que solicita los cursos de una categoria en especifico */
/* Serivicio que se encarga de obtener los cursos del estudiante */
import axios from '../../../../api/axiosInstance';
import type { TCourseTeacherResponse } from '../../types/Teacher';

const VITE_TEACHER_ENDPOINT = import.meta.env.VITE_TEACHER_ENDPOINT;

// Tipo para la respuesta esperada según el estándar
type TCreateLessonAPIResponse={
    status:number
    message: string;
};



export default async function UpdateIsPublishedAPI(idCourse:TCourseTeacherResponse['id'], isPublished:TCourseTeacherResponse['is_published']): Promise<TCreateLessonAPIResponse['status']> {
    try {
        const response = await axios.patch(`${VITE_TEACHER_ENDPOINT}/courses/${idCourse}`,{is_published:isPublished});

        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }


        return response.status;

    } catch (error) {
        console.error('Error en createCourses:', error);
        throw error;
    }
}
