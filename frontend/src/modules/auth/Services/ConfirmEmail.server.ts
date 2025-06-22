// Api que enviara el token de confirmEmail al backend


import axios from '../../../api/axiosInstance'
import type { TStudentProfileToken } from '../../types/User';

const VITE_CONFIRMEMAIL_ENDPOINT = import.meta.env.VITE_CONFIRMEMAIL_ENDPOINT;

export default async function confirmEmailAPI(token:TStudentProfileToken['token'])/* :Promise<TStudent[''] */ {

    try{
        const response = await axios.get(`${VITE_CONFIRMEMAIL_ENDPOINT}?token=${token}`);
        if(response.status === 201){
            // Quiere decir que ya fue registrado exitosamente
            return response.data
        }
        if(response.status === 404){
            throw new Error('Token no encontrado')
        }
        throw new Error('Error en el servidor')

    }catch(error){
        console.error('Error en confirmEmailAPI', error)
        throw error
    }
}
