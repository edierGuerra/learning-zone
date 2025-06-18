import axios from "axios";
import type { TUser } from "../../types/User";

const API_URL = import.meta.env.VITE_API_URL;

export const registerAPI = (
 dataRegister: Omit<TUser, 'id'>
) => {
  return axios.post(`${API_URL}/register`, {
    num_identification : dataRegister.num_identification,
    name:dataRegister.name,
    lastNames:dataRegister.lastNames,
    email:dataRegister.email,
    password:dataRegister.password,
  });
};
