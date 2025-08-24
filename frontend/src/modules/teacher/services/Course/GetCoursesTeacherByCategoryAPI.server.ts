/* Servicio que solicita los cursos de una categoria en especifico */
/* Serivicio que se encarga de obtener los cursos del estudiante */
import axios from '../../../../api/axiosInstance';
import type { TCourse } from '../../../courses/types/CourseStudent';
import type { TCoursesTeachers } from '../../types/Teacher';

export default async function GetCoursesTeacherByCategoryAPI(category:TCourse['category']): Promise<TCoursesTeachers> {
    try {
        /* traer el rol del estudiante y de acuerdo a este determinar el endpoint */
        const response = await axios.get(`/api/v1/teachers/courses/category/${category}`);
        // Validar status code
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
        }

        // Validar estructura de respuesta
      /*   const responseData = response.data as GetCoursesCategoryAPIResponse;
        if (!responseData.courses || !Array.isArray(responseData.courses)) {
            throw new Error('Respuesta del servidor inválida: estructura de datos incorrecta');
        } */
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.error('Error en GetCoursesByCategoryTeacher:', error);
        throw error;
    }
}
