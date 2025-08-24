/* Servicio que envia el email del usuario que desea recuperar la contraseña al backend */
import axios from "../../../api/axiosInstance";
import type { TStudent } from "../../types/User";

type RequestEmailResponse ={
  email: TStudent['email'],
  message:string
}
export const SendEmailRequestAPI = async (
 email:TStudent['email']
):Promise<RequestEmailResponse> => {
  try{
    const response = await axios.post("/api/v1/student/password/forgot",{email});
    return response.data
  }catch(error){
    console.error('Error en SendEmailRequestAPI', error)
    throw error
  }
}
