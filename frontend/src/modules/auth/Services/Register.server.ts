/* Servicio que envia los datos del register al backend  */
import axios from "../../../api/axiosInstance";
import type { TStudent } from "../../types/User";

type registerResponse ={
  email: TStudent['email'],
  id: TStudent['id'],
}
export const registerAPI = async (
 dataRegister:TStudent
):Promise<registerResponse> => {
  try{
    const registerData = {

      identification_number : dataRegister.numIdentification,
      names:dataRegister.name,
      last_names:dataRegister.lastNames,
      email:dataRegister.email,
      password:dataRegister.password,
      identification_id:dataRegister.id
    }
    const response = await axios.post("/api/v1/student",registerData);
    return response.data
  }catch(error){
    console.error('Error en RegisterAPI', error)
    throw error
  }
}
