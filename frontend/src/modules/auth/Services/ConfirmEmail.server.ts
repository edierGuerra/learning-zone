// Api que enviara el token de confirmEmail al backend


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

const VITE_CONFIRMEMAIL_ENDPOINT = import.meta.env.VITE_CONFIRMEMAIL_ENDPOINT;

export default async function confirmEmailAPI({token,idAutoIncrementStudent}:confirmEmailAPIProps):Promise<confirmEmailAPIPromise>  {
    
    console.log("👉 URL:", `${VITE_CONFIRMEMAIL_ENDPOINT}?email_token=${token}&id_student=${idAutoIncrementStudent}`);
    try{
        const response = await axios.get(`${VITE_CONFIRMEMAIL_ENDPOINT}?email_token=${token}&id_student=${idAutoIncrementStudent}`);
        // Quiere decir que ya fue registrado exitosamente
        console.log("👉 response", response);
        console.log("👉 response.data", response.data);
        console.log(response.data)
        return response.data

    }catch(error){
        console.error('Error en confirmEmailAPI', error)
        throw error
    }
}
