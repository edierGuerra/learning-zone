// Hook que contiene la logica general de confirmacion, se debe de extraer el token de la url,
// controlar los estados de mensaje, que es dependiendo de lo que el backend envia ,
// y el estado del acceso para dirijir al login o no

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { authStorage } from '../../../shared/Utils/authStorage'
import confirmEmailRegisterAPI from '../Services/ConfirmEmailRegister.server';
import { useUser } from '../Hooks/useAuth'; // Importar para usar initSession

export default function useConfirmEmailRegister() {
    // Mensaje que se renderizara en page ConfirmEMail
    const [message, setMessage] = useState<string | null>(null);
    // Estado que cambia a true si ya se confirmo el token en el backend
    const [success, setSuccess] = useState<boolean | null>(false);
    const hasRun = useRef(false); // ✅ Previene ejecuciones múltiples en desarrollo (modo Strict de React 18)
    
    // Hook de React Router para obtener parámetros de búsqueda
    const [searchParams] = useSearchParams();
    
    // Hook para inicializar sesión después de confirmar email
    const { initSession } = useUser();

    // Hacer uso para que se ejecute cuando se renderice el componente
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const confirm = async () => {
            // Múltiples métodos para obtener el token
            const tokenFromSearchParams = searchParams.get('token');
            // Extraer el id del estudiante desde la URL (hash)
            const idFromSearchParams = searchParams.get('id');
            
            // Método alternativo: extraer del hash manualmente
            const fullUrl = window.location.href;
            const hashPart = window.location.hash;
            
            // Método 1: Desde el hash completo
            const hashQuery = hashPart.includes('?') ? hashPart.split('?')[1] : '';
            const searchParamsFromHash = new URLSearchParams(hashQuery);
            const tokenFromHash = searchParamsFromHash.get('token');
            
            // Método 2: Regex más específico para el hash
            const hashTokenRegex = /#\/[^?]*\?.*[?&]?token=([^&#]+)/;
            const hashTokenMatch = fullUrl.match(hashTokenRegex);
            const tokenFromHashRegex = hashTokenMatch ? hashTokenMatch[1] : null;
            
            // Método 3: Regex general en toda la URL
            const generalTokenRegex = /[?&]token=([^&#]+)/;
            const generalTokenMatch = fullUrl.match(generalTokenRegex);
            const tokenFromGeneralRegex = generalTokenMatch ? generalTokenMatch[1] : null;
            
            // Método 4: Split manual más directo
            let tokenFromSplit = null;
            if (hashPart.includes('token=')) {
                const tokenPart = hashPart.split('token=')[1];
                if (tokenPart) {
                    tokenFromSplit = tokenPart.split('&')[0];
                }
            }
            
            // Debug información completa
            console.log('DEBUG: Full URL:', fullUrl);
            console.log('DEBUG: Hash part:', hashPart);
            console.log('DEBUG: Hash query part:', hashQuery);
            console.log('DEBUG: window.location.search:', window.location.search);
            console.log('DEBUG: searchParams token (useSearchParams):', tokenFromSearchParams);
            console.log('DEBUG: token from hash manually:', tokenFromHash);
            console.log('DEBUG: token from hash regex:', tokenFromHashRegex);
            console.log('DEBUG: token from general regex:', tokenFromGeneralRegex);
            console.log('DEBUG: token from split:', tokenFromSplit);

            
            // Usar el primer token válido que encontremos
            const finalToken = tokenFromSearchParams || tokenFromHash || tokenFromHashRegex || tokenFromGeneralRegex || tokenFromSplit;
            const finalId = idFromSearchParams;

            // EN caso de que no exista un token o el ID no esté disponible, definir success como false
            if (!finalToken || !finalId) {
                console.log('DEBUG: Missing token or id (from URL)');
                console.log('DEBUG: finalToken is null?', finalToken === null);
                console.log('DEBUG: finalToken is empty?', finalToken === '');
                console.log('DEBUG: finalId is null?', finalId === null);
                setMessage('Enlace inválido: falta información requerida');
                setSuccess(false);
                return;
            }

            try {
                const idAsNumber = Number(finalId);
                console.log('DEBUG: Calling confirmEmailRegisterAPI with:', { token: finalToken, idAutoIncrementStudent: idAsNumber });
                // EN caso de que exista el token, realizar peticion al backend
                const responseConfirm = await confirmEmailRegisterAPI({ token: finalToken, idAutoIncrementStudent: idAsNumber });

                console.log('DEBUG: Response from backend:', responseConfirm);
                // Si la respuesta es inválida o vacía
                if (!responseConfirm) {
                    setMessage('Ups! hubo un error');
                    return;
                }
                if(responseConfirm.is_active){
                    // Almacenando en el localStorage
                    authStorage.setToken(responseConfirm.access_token)
                    
                    // Inicializar sesión después de guardar el token
                    console.log('🔄 Inicializando sesión después de confirmar email...');
                    const sessionInitialized = await initSession();
                    
                    if (sessionInitialized) {
                        console.log('✅ Sesión inicializada correctamente');
                        setMessage('Cuenta confirmada exitosamente. Redirigiendo...');
                        setSuccess(true);
                    } else {
                        console.log('❌ Error al inicializar sesión');
                        setMessage('Error al inicializar la sesión. Intenta hacer login manualmente.');
                        setSuccess(false);
                    }
                    
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
