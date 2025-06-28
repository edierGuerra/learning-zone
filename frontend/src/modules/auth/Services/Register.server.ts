import axios from "../../../api/axiosInstance";
import type { TStudent } from "../../types/User";

const REGISTER_ENDPOINT = import.meta.env.VITE_REGISTER_ENDPOINT;

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
    const response = await axios.post(`${REGISTER_ENDPOINT}`,registerData);
    return response.data
  }catch(error){
    console.error('Error en RegisterAPI', error)
    throw error
  }
}



