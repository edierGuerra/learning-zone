// Api que enviara el token de de confirmacion del correo del register

import axios from '../../../api/axiosInstance'
import type { TStudent, TStudentProfileToken } from '../../types/User';
type confirmEmailAPIProps ={
    token: TStudentProfileToken['token'];
    idAutoIncrementStudent?: TStudent['id'];
}
type confirmEmailAPIPromise ={
    access_token:TStudentProfileToken['token'],
    is_active: boolean,
}

export default async function confirmEmailRegisterAPI({token,idAutoIncrementStudent}:confirmEmailAPIProps):Promise<confirmEmailAPIPromise>  {
    try{
        const url = `/api/v1/student/verify_email/?email_token=${token}&id_student=${idAutoIncrementStudent}`;
        console.log('DEBUG: Making request to:', url);
        console.log('DEBUG: Token:', token);
        console.log('DEBUG: Student ID:', idAutoIncrementStudent);
        
        const response = await axios.get(url);
        
        console.log('DEBUG: Response status:', response.status);
        console.log('DEBUG: Response data:', response.data);
        
        return response.data

    }catch(error){
        console.error('ERROR en confirmEmailRegisterAPI:', error);
        if (error.response) {
            console.error('ERROR Response status:', error.response.status);
            console.error('ERROR Response data:', error.response.data);
        }
        throw error
    }
}
