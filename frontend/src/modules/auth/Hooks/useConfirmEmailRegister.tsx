// Hook que contiene la logica general de confirmacion, se debe de extraer el token de la url,
// controlar los estados de mensaje, que es dependiendo de lo que el backend envia ,
// y el estado del acceso para dirijir al login o no

import { useEffect, useRef, useState } from 'react'
import { authStorage } from '../../../shared/Utils/authStorage'
import confirmEmailRegisterAPI from '../Services/ConfirmEmailRegister.server';

export default function useConfirmEmailRegister() {
    // Mensaje que se renderizara en page ConfirmEMail
    const [message, setMessage] = useState<string | null>(null);
    // Estado que cambia a true si ya se confirmo el token en el backend
    const [success, setSuccess] = useState<boolean | null>(false);
    const hasRun = useRef(false); // ✅ Previene ejecuciones múltiples en desarrollo (modo Strict de React 18)

    // Hacer uso para que se ejecute cuando se renderice el componente
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const confirm = async () => {
            // Para HashRouter, necesitamos extraer parámetros del hash
            const fullUrl = window.location.href;
            const hashPart = window.location.hash; // #/confirmEmailRegister?token=...
            
            console.log('DEBUG: Full URL:', fullUrl);
            console.log('DEBUG: Hash part:', hashPart);
            console.log('DEBUG: window.location.search:', window.location.search);
            
            // Extraer parámetros del hash si existen
            let params;
            if (hashPart.includes('?')) {
                const queryString = hashPart.split('?')[1];
                params = new URLSearchParams(queryString);
            } else {
                // Fallback a search normal
                params = new URLSearchParams(window.location.search);
            }
            
            const token = params.get('token');
            const idAutoIncrementStudent = authStorage.getIdAutoIncrementStudent();

            console.log('DEBUG: token from URL:', token);
            console.log('DEBUG: idAutoIncrementStudent from localStorage:', idAutoIncrementStudent);

            // EN caso de que no exista un token o el ID no esté disponible, definir success como false
            if (!token || idAutoIncrementStudent === null) {
                console.log('DEBUG: Missing token or idAutoIncrementStudent');
                setMessage('Enlace inválido: falta información requerida');
                setSuccess(false);
                return;
            }
            try {
                console.log('DEBUG: Calling confirmEmailRegisterAPI with:', { token, idAutoIncrementStudent });
                // EN caso de que exista el token, realizar peticion al backend
                const responseConfirm = await confirmEmailRegisterAPI({ token, idAutoIncrementStudent });

                console.log('DEBUG: Response from backend:', responseConfirm);
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
                    setMessage('La cuenta no se pudo activar. Contacta al administrador.');
                    setSuccess(false);
                }

            } catch (error) {
                // Error capturado en caso de fallar la solicitud o expirar el token
                console.error('DEBUG: Error caught:', error);
                setMessage('El enlace es inválido o ha expirado');
                setSuccess(false);
            }
        };

        confirm();
    }, []);

    return { message, success };
}
