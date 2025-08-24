/* Servicio que envia los datos del formulario del login al backend  */

import axios from "../../../api/axiosInstance";

import type { TStudent, TStudentProfileToken } from '../../types/User';

type TLoginAPIProps ={
  email: TStudent['email'],
  password:TStudent['password']
}

type TLoginAPIResponse ={
  access_token: TStudentProfileToken['token'],
  message: string
}

export const loginAPI = async({email, password}:TLoginAPIProps):Promise<TLoginAPIResponse> => {
  try{
    const response = await axios.post("/api/v1/student/login", {email,password})
    return response.data

  }catch(error){
    console.log('Error en loginAPI', error)
    throw error

  }
};
