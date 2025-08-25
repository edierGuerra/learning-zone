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
        const response = await axios.get(`/api/v1/student/verify_email/?email_token=${token}&id_student=${idAutoIncrementStudent}`);
        return response.data

    }catch(error){
        console.error('Error en confirmEmailRegisterAPI', error)
        throw error
    }
}
