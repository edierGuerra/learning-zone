/* Servicio que se encarga de enviar la nueva contraseña */
/* Se envian el token el cual es el que se recupera cuando el usuario clickea en el btn del correo que le llego al email, y la contraseña */
/*  */

import axios from "../../../api/axiosInstance";
import type { TStudent, TStudentProfileToken } from "../../types/User";

type TRequestNewPaswordAPIProps ={
    tokenRequestEmail: TStudentProfileToken['token'],
    password : TStudent['password']
}


export const SendPasswordRequestAPI=async({ tokenRequestEmail,password}:TRequestNewPaswordAPIProps)=> { /* Falta hacer promise que aun no se saben los datos */
    try{
        const data = {
            token: tokenRequestEmail,
            new_password:password
        }
        const response = await axios.put("/api/v1/student/password/reset", data)
        // Si el backend retorna 204, response.data será undefined.
        if (response.status === 200) {
        return { success: true }; // retornamos manualmente algo útil
        }

    }catch(error){
        console.error('Error en SendPasswordRequestAPI', error)
        throw error

    }

}
