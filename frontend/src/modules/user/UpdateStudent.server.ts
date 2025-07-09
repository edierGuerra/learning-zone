import axios from '../../api/axiosInstance'

import type { TStudent } from '../types/User'


type TUpdateStudentAPIProps ={
    student : Omit<TStudent, 'id' | 'password'> 
}
type TUpdateStudentResponse = {
  statusCode: number;
  message: string;
};
const VITE_UPDATESTUDENT_ENDPOINT = import.meta.env.VITE_UPDATESTUDENT_ENDPOINT;



export default async function UpdateStudentAPI({student}:TUpdateStudentAPIProps):Promise<TUpdateStudentResponse> {
    try{
        const infoSudent = {
            num_identification:student.numIdentification,
            names: student.name,
            last_names: student.lastNames,
            email:student.email
        
        }
        const response = await axios.put(VITE_UPDATESTUDENT_ENDPOINT,infoSudent)
        return response.data

    }catch(error){
        console.error(error)
        throw error

    }
 

}
