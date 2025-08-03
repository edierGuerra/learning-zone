/* Servicio encargado de actualizar un curso */
import axios from '../../../../api/axiosInstance';
import type { TCourseTeacherSend, TCourseTeacherResponse } from '../../types/Teacher';

const VITE_TEACHER_ENDPOINT = import.meta.env.VITE_TEACHER_ENDPOINT;

// Tipo de respuesta esperada del backend
type TUpdateCourseAPIResponse = {
  status: number;
  message: string;
  id_course: TCourseTeacherResponse['id'];
};

/**
 * Esta función permite actualizar un curso existente.
 * Recibe los datos del curso y su ID, y hace una solicitud PUT al backend.
 */
export default async function UpdateCourseAPI(
  id_course: TCourseTeacherResponse['id'], // ID del curso que se desea actualizar
  course: TCourseTeacherSend               // Datos nuevos del curso
): Promise<TCourseTeacherResponse['id']> {
  try {
    // Creamos el formulario que se va a enviar como multipart/form-data
    const formData = new FormData();
    formData.append("name", course.name);
    formData.append("description", course.description);
    if (course.image) {
      formData.append("image", course.image); // Si hay una imagen nueva, se incluye
    }

    // Enviamos la solicitud PUT al backend, pasando el ID del curso en la URL
    const response = await axios.put(`${VITE_TEACHER_ENDPOINT}/courses/${id_course}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Validamos que el estado HTTP sea exitoso
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.data?.message || 'Error desconocido'}`);
    }

    const responseData = response.data as TUpdateCourseAPIResponse;

    // Verificamos que el backend haya devuelto un ID válido
    if (!responseData.id_course || typeof responseData.id_course !== "number") {
      throw new Error('Respuesta inválida: no se recibió un ID de curso correcto');
    }

    // Devolvemos el ID del curso actualizado
    return responseData.id_course;

  } catch (error) {
    console.error('Error en UpdateCourseAPI:', error);
    throw error;
  }
}
