import { useCallback,  useEffect, useState  } from "react"
import { authStorage } from "../../../shared/Utils/authStorage"
import { useUser } from "../../auth/Hooks/useAuth"
import DeleteNotificationsAPI from "../services/DeleteNotifications.server"
import GetNotificationsAPI from "../services/GetNotifications.server"

/* Logica de las notificaciones */
export default function useNotifications(pollingInterval=4000 ) {
    const {setNotifications, isReady } = useUser()
    const [loadingNot, setLoadingNot] = useState(false)

    const refreshNotifications = useCallback(async () => {
        const updated = await GetNotificationsAPI();
        setNotifications(updated);
        authStorage.setNotifications(updated);
    }, [setNotifications]); // Solo cambia si cambia `setNotifications`

    // Activar polling (peticion automatica) automático con useEffect

     useEffect(() => {
        if(isReady){
            // Llama al cargar
            refreshNotifications();
            const timer = setInterval(refreshNotifications, pollingInterval);
            // Llama cada [pollingInterval] milisegundos
        return () => clearInterval(timer);

    }

    }, [refreshNotifications,pollingInterval,isReady]);
 
    const deleteItemNotification= async(idItemNotification:number)=>{
        try{
            setLoadingNot(true);
            const response = await DeleteNotificationsAPI(idItemNotification)
            /* Si la eliminacion fue exitosa solicitar de nuevo las notificaciones */
            if(response.status === 200){
                await refreshNotifications()
                await new Promise((resolve) => setTimeout(resolve, 500));
                
            }
            else{
                alert(response.message)
                
            }
            
        }catch(error){
            alert(error)
        }
        finally{
            setLoadingNot(false)
        }
    }
    const deleteAllNotification= async()=>{
        try{
            setLoadingNot(true);
            await new Promise((resolve) => setTimeout(resolve, 500));

            const response = await DeleteNotificationsAPI()
            /* Si la eliminacion fue exitosa solicitar de nuevo las notificaciones */
            if(response.status === 200){
                await refreshNotifications()
            }
            else{
                alert(response.message)

            }

        }catch(error){
            alert(error)
        }finally{
            setLoadingNot(false)

        }
    }


  return {
    deleteItemNotification,
    deleteAllNotification,
    loadingNot


  }
}
