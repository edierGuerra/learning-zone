/* Servicio que solicita todos los usuarios
 */
import axios from '../../../api/axiosInstance';
import type { TStudent, TStudentProfile } from '../../types/User';
const VITE_ALLSTUDENTS_ENDPOINT = import.meta.env.VITE_ALLSTUDENTS_ENDPOINT;
type TResponseGetAllStudentsAPI ={
    id: TStudent['id'],
    num_identification: TStudent['numIdentification'],
    name: TStudent['name'],
    last_names: TStudent['lastNames'],
    email: TStudent['email'],
    prefix_profile: TStudentProfile['prefixProfile'],
}
export default async function GetAllStudentsCommentsAPI():Promise<TResponseGetAllStudentsAPI[]> {
    try{
        const response = await axios.get(VITE_ALLSTUDENTS_ENDPOINT)
        return response.data

    }catch(error){
        console.error('Error en getAllStudents')
        throw error

    }
}
