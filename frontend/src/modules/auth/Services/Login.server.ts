/* const API_URL = import.meta.url.VITE_API_URL;
const LOGIN_ENDPOINT = import.meta.env.VITE_AUTH_ENDPOINT; */

import axios from "../../../api/axiosInstance";

import type { TStudent, TStudentProfileToken } from '../../types/User';

const VITE_LOGIN_ENDPOINT = import.meta.env.VITE_LOGIN_ENDPOINT;

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
    const response = await axios.post(VITE_LOGIN_ENDPOINT, {email,password})
    return response.data

  }catch(error){
    console.log('Error en loginAPI', error)
    throw error

  }
};
