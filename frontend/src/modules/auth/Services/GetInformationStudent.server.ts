    /* Servicio que envia el access token - token de acceso al backend, con el fin de recibir los datos del estudiante */
    import axios from "../../../api/axiosInstance";
    import type { TStudent } from "../../types/User";

    const VITE_GETSTUDENT_ENDPOINT = import.meta.env.VITE_GETSTUDENT_ENDPOINT;

    type TUserDataResponse ={
        id: TStudent['id'],
        identification_number:TStudent['numIdentification'],
        names: TStudent['name'],
        last_names: TStudent['lastNames'],
        email: TStudent['email'],

    }
    type TStudentResponseAPI ={
        user_data:TUserDataResponse,
        prefix_profile: string,
    }


    // Aqui no se requiere que se envie el token ya que En api/axiosInstance se inyecta el token automaticamente
    export const GetStudentAPI =async():Promise<TStudentResponseAPI>=>{
        try{
            const response = await axios.get(VITE_GETSTUDENT_ENDPOINT)
            return response.data

        }catch(err){
            console.log('Error', err)
            throw err
            

        }
            

    }

