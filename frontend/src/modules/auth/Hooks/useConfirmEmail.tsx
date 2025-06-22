// Hook que contiene la logica general de confirmacion, se debe de extraer el token de la url, controlar los estados de mensaje, que es dependiendo de lo que el backend envia ,  y el estado del acceso para dirijir al login o no

import { useEffect, useState } from 'react'
import confirmEmailAPI from '../Services/ConfirmEmail.server';


export default function useConfirmEmail() {
    //Obteniendo el id del estudiante que se registro
    const id = localStorage.getItem('idStudent')
    console.log(id)
    // Mensaje que se renderizara en page ConfirmEMail
    const [message, setMessage] = useState<string | null>(null);
    // Estado que cambia a true si ya se confirmo el token en el backend
    const [success, setSuccess] = useState<boolean | null>(null);
    
    // Hacer uso para que se ejecute cuando se renderice el componente
    useEffect(()=>{
        const confirm =async()=>{
            const params = new URLSearchParams(window.location.search) // Esto busca en la URL y convierte en clave valor, con el fin de poder acceder al token
            const token = params.get('token');
            // EN caso de que no exista un token, definir success como false
            if(!token){
                setSuccess(false);
                return
            }
            // EN caso de que exista el token, realizar peticion al backend
            try{
                const responseConfirm =  await confirmEmailAPI(token)
                if(!responseConfirm){
                    throw new Error('Token expirado')
                }
                setMessage(responseConfirm.message ||'Cuenta confirmada exitosamente. Redirigiendo...');
                setSuccess(true);

            }catch(error){
                console.error(error)
                setMessage('El enlace es invalido o ha expirado')
                setSuccess(false)
            }
                
            }
        confirm();
        },[])

  return {message,success}
}