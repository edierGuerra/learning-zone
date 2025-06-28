
import axios from "../../../api/axiosInstance";
import type { TStudent } from "../../types/User";

const VITE_GETSTUDENT_ENDPOINT = import.meta.env.VITE_CONFIRMEMAIL_ENDPOINT;

type TStudentResponseAPI ={
    id: TStudent['id'],
    identification_number:TStudent['numIdentification'],
    names: TStudent['name'],
    last_names: TStudent['lastNames'],
    email: TStudent['email'],
    prefix_profile: string,
}


// Aqui no se requiere que se envie el token ya que En api/axiosInstance se inyecta el token automaticamente
export const GetStudentAPI =async():Promise<TStudentResponseAPI>=>{
    try{
        const response = await axios.post(VITE_GETSTUDENT_ENDPOINT)
        return response.data

    }catch(err){
        console.log('Error', err)
        throw err
        

    }
        

}

