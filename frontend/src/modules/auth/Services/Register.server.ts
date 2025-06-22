import axios from "../../../api/axiosInstance";
import type { TStudent } from "../../types/User";

const REGISTER_ENDPOINT = import.meta.env.VITE_REGISTER_ENDPOINT;

export const registerAPI = async (
 dataRegister:Omit<TStudent, 'id'>
):Promise<TStudent['id']> => {
  try{
    const registerData = {
      num_identification : dataRegister.numIdentification,
      name:dataRegister.name,
      lastNames:dataRegister.lastNames,
      email:dataRegister.email,
      password:dataRegister.password,
    }
    const response = await axios.post(`${REGISTER_ENDPOINT}`,registerData);
    if(response.status === 200){
      // retornar data
      return response.data
    }
    throw new Error('Error del servidor')
  }catch(error){
    console.error('Error en RegisterAPI', error)
    throw error
  }
}
