// Conexion al backend y envio de el numero de identificacion
import type { TStudent } from "../../types/User";
import axios from "../../../api/axiosInstance";

const VERIFY_ENDPOINT = import.meta.env.VITE_VERIFY_ENDPOINT;

export default async function verifyAPI(nIdentification:TStudent['numIdentification']):Promise<TStudent['id']> {

    try{
        const response = await axios.post(`${VERIFY_ENDPOINT}`,{nIdentification:nIdentification}) 
        if(response.status === 200){
            // Retornar id del numero de identificacion
            return response.data
        }
        if(response.status === 404){
            throw new Error('N identificación no encontrado')
            // Lanzado si el servidor dice que NO encontró al usuario.
            // Esto obliga al componente a manejarlo como error (por ejemplo, mostrar alerta).
        }
        throw new Error('Error del servidor')
        //Lanzado si el status no es ni 200 ni 404. (ej: 500, 400, etc.)
    }catch(error){
        console.error('Error en verifyAPI', error)
        throw error // Relanza el error para que la función que usa verifyAPI pueda capturar dicho error.
    //    Si no se hace, verifyAPI retorna undefined, y lo que quiero es que falle, y en caso tal de que no falle debe de retornar un id

    }
}