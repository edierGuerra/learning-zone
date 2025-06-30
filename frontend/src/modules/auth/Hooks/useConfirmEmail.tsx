// Hook que contiene la logica general de confirmacion, se debe de extraer el token de la url,
// controlar los estados de mensaje, que es dependiendo de lo que el backend envia ,
// y el estado del acceso para dirijir al login o no

import { useEffect, useRef, useState } from 'react'
import confirmEmailAPI from '../Services/ConfirmEmail.server'
import { authStorage } from '../../../shared/Utils/authStorage'

export default function useConfirmEmail() {
    // Mensaje que se renderizara en page ConfirmEMail
    const [message, setMessage] = useState<string | null>(null);
    // Estado que cambia a true si ya se confirmo el token en el backend
    const [success, setSuccess] = useState<boolean | null>(false);
    const hasRun = useRef(false); // ✅ Previene ejecuciones múltiples en desarrollo (modo Strict de React 18)

    // Hacer uso para que se ejecute cuando se renderice el componente
    useEffect(() => {
        if (hasRun.current) return; // ⛔️ Detiene segunda ejecución accidental en desarrollo
        hasRun.current = true;

        const confirm = async () => {
            const params = new URLSearchParams(window.location.search); // Esto busca en la URL y convierte en clave valor, con el fin de poder acceder al token
            const token = params.get('token');
            const idAutoIncrementStudent = authStorage.getIdAutoIncrementStudent();

            // EN caso de que no exista un token o el ID no esté disponible, definir success como false
            if (!token || idAutoIncrementStudent === null) {
                setSuccess(false);
                return;
            }
            try {
                // EN caso de que exista el token, realizar peticion al backend
                const responseConfirm = await confirmEmailAPI({ token, idAutoIncrementStudent });

                // Si la respuesta es inválida o vacía
                if (!responseConfirm) {
                    setMessage('Ups! hubo un error');
                    return;
                }
                if(responseConfirm.is_active){
                    // Almacenando en el localStorage
                    authStorage.setToken(responseConfirm.access_token)
                    setMessage('Cuenta confirmada exitosamente. Redirigiendo...');
                    setSuccess(true);
                    // removiendo el email del localstorage
                    authStorage.removeEmail();
                    authStorage.removeIdAutoIncrementStudent();
                }
                else{
                    return
                }

            } catch (error) {
                // Error capturado en caso de fallar la solicitud o expirar el token
                console.error(error);
                setMessage('El enlace es inválido o ha expirado');
                setSuccess(false);
            }
        };

        confirm();
    }, []);

    return { message, success };
}
