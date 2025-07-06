/* Servicio que envia el email del usuario que desea recuperar la contraseña al backend */
import axios from "../../../api/axiosInstance";
import type { TStudent } from "../../types/User";

const VITE_CONFIRMEMAILREQUEST_ENDPOINT = import.meta.env.VITE_CONFIRMEMAILREQUEST_ENDPOINT;

type RequestEmailResponse ={
  email: TStudent['email'],
}
export const SendEmailRequestAPI = async (
 email:TStudent['email']
):Promise<RequestEmailResponse> => {
  try{
    const response = await axios.post(`${VITE_CONFIRMEMAILREQUEST_ENDPOINT}`,{email});
    return response.data
  }catch(error){
    console.error('Error en SendEmailRequestAPI', error)
    throw error
  }
}
