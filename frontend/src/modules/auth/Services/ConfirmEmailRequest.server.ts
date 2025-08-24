// Api que enviara el token de correo en recuperacion de contraseña al backend


import axios from '../../../api/axiosInstance'
import type { TStudentProfileToken } from '../../types/User';

/* FALTA AGREGAR ESTOS DATOS DEPENDIENDO DE QUE RETORNE Y QUE RECIBE EL BACKEND */
type confirmEmailAPIProps ={
    token: TStudentProfileToken['token'];
}
type confirmEmailAPIPromise ={
    password_token:TStudentProfileToken['token'],
}

export default async function confirmEmailRequestAPI({token} : confirmEmailAPIProps):Promise<confirmEmailAPIPromise>{
    try{
        const response = await axios.get("/api/v1/student/password/validate-token-password",{
            headers:{
                token: token,
            },
        });
        return response.data

    }catch(error){
        console.error('Error en confirmEmailRequestAPI', error)
        throw error
    }
}
