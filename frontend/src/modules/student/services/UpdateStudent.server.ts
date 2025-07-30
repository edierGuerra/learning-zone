import axios from '../../../api/axiosInstance'

import type { TStudent } from '../../types/User'


type TUpdateStudentAPIProps ={
    student : Omit<TStudent, 'id' | 'password' | 'email' | 'numIdentification'>
}
type TUpdateStudentResponse = {
  statusCode: number;
  message: string;
};
const VITE_UPDATESTUDENT_ENDPOINT = import.meta.env.VITE_UPDATESTUDENT_ENDPOINT;



export default async function UpdateStudentAPI({student}:TUpdateStudentAPIProps):Promise<TUpdateStudentResponse> {
    try{
        const infoSudent = {
            names: student.name,
            last_names: student.lastNames,

        }
        const response = await axios.put(VITE_UPDATESTUDENT_ENDPOINT,infoSudent)
        return {
            statusCode:response.status,
            message:response.data?.message
        }

    }catch(error){
        console.error(error)
        throw error

    }


}
