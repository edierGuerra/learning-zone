/* Logica general de todo lo que tiene que ver con la recuperacion de contraseña */

import { useState } from "react"
import type { TStudent, TStudentProfileToken } from "../../types/User"
import { SendEmailRequestAPI } from "../Services/SendEmailRequestPassword.server";
import { authStorage } from "../../../shared/Utils/authStorage";
import { SendPasswordRequestAPI } from "../Services/NewPassword.server";

export default function useRecoverPassword() {

    type RequestPassworForm =Pick<TStudent, 'email' | 'password'> &{
        confirmPassword:string
    };
    type FormErrors = Partial<Record<keyof RequestPassworForm, string>>;
    // --- Constantes de validación ---
    const MIN_PASSWORD_LENGTH = 6;

    const [loading,setLoading] = useState(false);
    
    const [email, setEmail] = useState<TStudent['email']>(); // Estado que controla el email
    const [password, setPassword] = useState<TStudent['password']>(''); // Inicializa con cadena vacía
    const [confirmPassword, setConfirmPassword] = useState<TStudent['password']>(''); // Inicializa con cadena vacía
    const [viewFormNewPassword, setViewFormNewPassword] = useState(false); /*  Estado que me permitira manipular cuando debo de mostrar el formulario de agregar nueva contraseña, por defecto es false ya que este debe de colocar primero el email para poder verificarlo y solicitarle la nueva contraseña */
    const [errors, setErrors] = useState<FormErrors>({}); // Estado que controla y almacena los errores en caso de que existan

    const [viewSucessMessage, setViewSucessMessage] = useState(false)


    // --- Mensajes centralizados para reutilización y claridad ---
    const ERROR_MESSAGES = {
    required: (field: string) => `El ${field} es obligatorio.`,
    invalidEmail: "El formato del correo electrónico no es válido.",
    minLength: (field: string, length: number) => `La ${field} debe tener al menos ${length} caracteres.`,
    passwordsDoNotMatch: "Las contraseñas no coinciden.",
    };
    // --- Validadores unitarios ---
    const isRequired = (value: string): boolean => value.trim().length > 0;
    const isValidEmail = (email: string): boolean =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    const hasMinLength = (value: string, min: number): boolean =>
    value.length >= min;

    const validateEmail = (email:RequestPassworForm['email']): FormErrors => {
        const errors: FormErrors = {};
        if (!isRequired(email)) {
            errors.email = ERROR_MESSAGES.required("correo electrónico");
        } else if (!isValidEmail(email)) {
            errors.email = ERROR_MESSAGES.invalidEmail;
        }
        
        return errors;
        
    }
    
    const validatesPasswords =(form:Pick<RequestPassworForm, 'password' |'confirmPassword'>) =>{
        const errors: FormErrors = {};
        
        // Validar contraseña
        if (!isRequired(form.password)) {
            errors.password = ERROR_MESSAGES.required("contraseña");
        } else if (!hasMinLength(form.password, MIN_PASSWORD_LENGTH)) {
            errors.password = ERROR_MESSAGES.minLength("contraseña", MIN_PASSWORD_LENGTH);
        }
        
        // Validar confirmación
        if (form.confirmPassword !== form.password) {
            errors.confirmPassword = ERROR_MESSAGES.passwordsDoNotMatch;
        }
        return errors;


    }






    const handleSubmitRequestEmail  = async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
       // Validacion de campos
        // Recurrir a la funcion que valida los campos
        const validationsErrors = validateEmail(email!)
        //Si hay errores de validación → los guarda en el estado y cancela el envío del formulario
        if (Object.keys(validationsErrors).length > 0) {
        setErrors(validationsErrors); // Muestra los mensajes de error en el UI
        return; // No se llama al backend porque hay errores
        }
        setLoading(true)
        try{
            const response = await SendEmailRequestAPI(email!);
            // Guardando el email en el localStorage
            authStorage.setEmail(response.email)
            setViewSucessMessage(true) /* Esto permite mostrar una 'advertencia' que muestre que se va direccionar a una parte, y ademas redirijir con el useEffect*/
        }catch{
            alert('No se pudo encontrar tu cuenta')
        }finally{
            setLoading(false)
        } 

    }

    const handleSubmitRequestPasswords= async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const passwords:Pick<RequestPassworForm, 'password' |'confirmPassword'>={
            password:password,
            confirmPassword:confirmPassword
        }
        // Validacion de campos
        // Recurrir a la funcion que valida los campos
        const validationsErrors = validatesPasswords(passwords)
        //Si hay errores de validación → los guarda en el estado y cancela el envío del formulario
        if (Object.keys(validationsErrors).length > 0) {
        setErrors(validationsErrors); // Muestra los mensajes de error en el UI
        return; // No se llama al backend porque hay errores
        }
        const tokenRequestEmail:TStudentProfileToken['token'] | null = authStorage.getRequestEmailToken() // Obteniendo token de request
        if(!tokenRequestEmail){
            console.log('No se encontro ningun token')
            return
        }
        setLoading(true)
        try{
            const response = await SendPasswordRequestAPI({tokenRequestEmail,password});
            if(response?.success){
                setViewSucessMessage(true)
                setTimeout(() => {
                    authStorage.removeEmail();
                    authStorage.removeRequestEmailToken()
                    window.location.href = '/login';
                }, 2000);

            }
        }catch{
            alert('No se pudo Cambiar la contarseña')
        }finally{
            setLoading(false)
        }


    }

    
  return {
    
  // Estados del formulario
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,

  // Control de carga y errores
  loading,
  errors,
  setViewSucessMessage,
  viewSucessMessage,

  // Funciones de envío
  handleSubmitRequestEmail,
  handleSubmitRequestPasswords,

  // Control de formularios (email/ passwords)
  setViewFormNewPassword,
  viewFormNewPassword

  }
}
