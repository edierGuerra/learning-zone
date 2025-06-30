// Conexion al backend y envio de el numero de identificacion
import type { TStudent } from "../../types/User";
import axios from "../../../api/axiosInstance";
type VerifyResponse = {
  message: string;
  can_register: boolean;
  status_code: number;
  identification_id: TStudent['id'] ;
};
const VERIFY_ENDPOINT = import.meta.env.VITE_VERIFY_ENDPOINT;

export default async function verifyAPI(nIdentification:TStudent['numIdentification']):Promise<VerifyResponse> {
    try{
        const response = await axios.post(`${VERIFY_ENDPOINT}`, {
  identification_code: nIdentification
});
        return response.data
    }catch(error){
        console.error('Error en verifyAPI', error)
        throw error // Relanza el error para que la función que usa verifyAPI pueda capturar dicho error.
    //    Si no se hace, verifyAPI retorna undefined, y lo que quiero es que falle, y en caso tal de que no falle debe de retornar un id

    }
}
