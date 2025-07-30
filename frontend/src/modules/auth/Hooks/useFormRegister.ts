/* Hook que agrupa la logica del Register */

import { useState } from "react";
import type { TStudent } from "../../types/User";
import verifyAPI from "../Services/Verify.server";
import { registerAPI } from "../Services/Register.server";
import { authStorage } from "../../../shared/Utils/authStorage";
import {toast} from "react-hot-toast";
export default function useFormRegister() {
  // --- Tipos de datos usados en el formulario ---
  type RegisterForm =TStudent & {
      confirmPassword: string;
  };

  // permite tener un error por cada campo (o ninguno)
  type FormErrors = Partial<Record<keyof RegisterForm, string>>;


  const [loading,setLoading] = useState(false);

  const [idAutoIncrement, setIdAutoIncrement] = useState<TStudent['id']>()
  const [nIdentification, setNIdentification] = useState<TStudent['numIdentification']>()
  const [name, setName] = useState<TStudent['name']>(''); // Inicializa con cadena vacía
  const [lastNames, setLastNames] = useState<TStudent['lastNames']>(''); // Inicializa con cadena vacía
  const [email, setEmail] = useState<TStudent['email']>(''); // Inicializa con cadena vacía
  const [password, setPassword] = useState<TStudent['password']>(''); // Inicializa con cadena vacía
  const [confirmPassword, setConfirmPassword] = useState<TStudent['password']>(''); // Inicializa con cadena vacía
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({}); // Estado que controla y almacena los errores en caso de que existan

  const [viewSucessMessage, setViewSucessMessage] = useState(false)



  const [formVerify, setFormVerify] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  // --- Constantes de validación ---
  const MIN_PASSWORD_LENGTH = 6;
  const MIN_NIDENTIFICATION = 10;

  // --- Mensajes centralizados para reutilización y claridad ---
  const ERROR_MESSAGES = {
    required: (field: string) => `El ${field} es obligatorio.`,
    invalidEmail: "El formato del correo electrónico no es válido.",
    minLength: (field: string, length: number) => `La ${field} debe tener al menos ${length} caracteres.`,
    passwordsDoNotMatch: "Las contraseñas no coinciden.",
  };

  // --- Validadores reutilizables (unitarios) ---
  const isRequired = (value: string): boolean => value.trim().length > 0;

  const isValidEmail = (email: string): boolean =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const hasMinLength = (value: string, min: number): boolean =>
    value.length >= min;

  // --- Validador principal del formulario ---
const validateForm = (form: RegisterForm): FormErrors => {
  const errors: FormErrors = {};

  // Validar número de identificación
  if (!form.numIdentification || !hasMinLength(form.numIdentification.toString(), MIN_NIDENTIFICATION)) {
    errors.numIdentification = ERROR_MESSAGES.minLength("número de identificación", MIN_NIDENTIFICATION);
  }

  // Validar nombre
  if (!isRequired(form.name)) {
    errors.name = ERROR_MESSAGES.required("nombre");
  }

  // Validar apellidos
  if (!isRequired(form.lastNames)) {
    errors.lastNames = ERROR_MESSAGES.required("apellidos");
  }

  // Validar email
  if (!isRequired(form.email)) {
    errors.email = ERROR_MESSAGES.required("correo electrónico");
  } else if (!isValidEmail(form.email)) {
    errors.email = ERROR_MESSAGES.invalidEmail;
  }

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
};




  const handleSubmitRegisterVerify = async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()


    setLoading(true)
    try{
      if(!nIdentification || nIdentification?.toString().length <10){
        toast.error('¡Ups! Ingresa un número de identificación válido.');
        return
      }
      const response = await verifyAPI(nIdentification);
      if(!response?.can_register){
        toast.error(response.message)
        return
      }
      //Almacenar el id autoincrementable para enviarlo en el register
      toast.success('Verificación exitosa', { duration: 3000 });
      setIdAutoIncrement(response?.identification_id)
      /* Cambiar el estado del formulario se verify para que se muestre el de register */
      setFormVerify(false)


    }catch{
      toast.error('No se pudo verificar el numero de identificación')

    }finally{
      setLoading(false)

    }

  }
  const handleSubmitRegister =async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const formData:RegisterForm ={
      id : idAutoIncrement!,
      numIdentification:nIdentification!,
      name,
      lastNames,
      email,
      password,
      confirmPassword,
    }
    // Recurrir a la funcion que valida los campos
    const validationsErrors = validateForm(formData)
    //Si hay errores de validación → los guarda en el estado y cancela el envío del formulario
    if (Object.keys(validationsErrors).length > 0) {
      setErrors(validationsErrors); // Muestra los mensajes de error en el UI
      return; // No se llama al backend porque hay errores
    }
    setLoading(true)
    try{
      /* Llamada a la api para registrar los datos */
      const res = await registerAPI(formData)
      if(!res){
        toast.error('¡Algo salió mal! Intenta de nuevo.');
        return
      }
      // Obteniendo el id (primary key) del student
      /* console.log('Primary key user: ', res.student_id) */

      // Guardando el email en el localStorage
      toast.success('Registrado exitosamente', { duration: 3000 });
      setViewSucessMessage(true)
      authStorage.setEmail(res.email)
      authStorage.setIdAutoIncrementStudent(res.id)
    }catch{
      toast.error('No se pudo registrar tu cuenta')
    }finally{
      setLoading(false)

    }
  }





  return {
    // variables - funciones verify
    nIdentification,
    setNIdentification,
    handleSubmitRegisterVerify,
    formVerify,
    // variables - funciones register
    name,
    setName,
    lastNames,
    setLastNames,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    showPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    handleSubmitRegister,
    // Variables de animaciones
    loading,
    errors,
    viewSucessMessage,
  }
}
