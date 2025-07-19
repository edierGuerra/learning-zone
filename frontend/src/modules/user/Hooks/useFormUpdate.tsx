/* Hook que agrupa la lógica para actualizar datos del estudiante */

import React, { useState, useEffect } from 'react';
import type { TStudent, TStudentProfile } from '../../types/User';
import { authStorage } from '../../../shared/Utils/authStorage';
import UpdateStudentAPI from '../services/UpdateStudent.server';
import { GetStudentAPI } from '../../auth/Services/GetInformationStudent.server';
import { useUser } from '../../auth/Hooks/useAuth';
import toast from 'react-hot-toast';

export default function useFormUpdate() {
  const {setStudent}= useUser()
  // --- Tipos usados para validación ---
  type UpdateForm = {
    name: TStudent['name'];
    lastNames: TStudent['lastNames'];
  };

  // permite tener un error por cada campo (o ninguno)
  type FormErrors = Partial<Record<keyof UpdateForm, string>>;

  // --- Constantes de validación ---

  // --- Mensajes centralizados para reutilización y claridad ---
  const ERROR_MESSAGES = {
    required: (field: string) => `El ${field} es obligatorio.`,
    invalidEmail: "El formato del correo electrónico no es válido.",
    minLength: (field: string, length: number) => `La ${field} debe tener al menos ${length} caracteres.`,
  };

  // --- Validadores reutilizables (unitarios) ---
  const isRequired = (value: string): boolean => value.trim().length > 0;

  // --- Validador principal del formulario ---
  const validateForm = (form: UpdateForm): FormErrors => {
    const errors: FormErrors = {};


    if (!isRequired(form.name)) {
      errors.name = ERROR_MESSAGES.required("nombre");
    }

    if (!isRequired(form.lastNames)) {
      errors.lastNames = ERROR_MESSAGES.required("apellidos");
    }
    return errors;
  };

  // --- Estados del formulario ---
  const [newName, setNewName] = useState<TStudent['name']>(''); // Inicializa con cadena vacía
  const [newLastNames, setNewLastNames] = useState<TStudent['lastNames']>(''); // Inicializa con cadena vacía
  const [errors, setErrors] = useState<FormErrors>({}); // Almacena errores del formulario

  // --- Efecto que carga los datos desde el localStorage una vez ---
  const dataUser: TStudentProfile | null = authStorage.getUser();
  const infoBackUser= {
    name: dataUser?.name,
    lastNames : dataUser?.lastNames,

  }
  useEffect(() => {

    if (dataUser !== null) {
      setNewName(dataUser.name);
      setNewLastNames(dataUser.lastNames);
    } else {
      toast.error('¡Ups! No puedes actualizar la información en este momento.');
    }
  }, []);

  // --- Envío del formulario ---
  const handleSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const student: UpdateForm = {
      name: newName,
      lastNames: newLastNames,
    };

    const validationErrors = validateForm(student);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Si hay errores → los muestra
      return; // Detiene el envío
    }

    // Aquí iría la lógica para enviar los datos a la API
    // Aqui se valida que si halla cambiado algo

    if (JSON.stringify(student) === JSON.stringify(infoBackUser)) {
        toast.error('Parece que no has actualizado nada');
        return;
    }
    try{
      const response = await UpdateStudentAPI({student});
      if(response.statusCode ===200){
        toast.success('Actualizacion exitosa')
        const updateStudent = await GetStudentAPI()
        const dataStudentLocalStorage:TStudentProfile ={
          id:updateStudent.user_data.id,
          numIdentification:updateStudent.user_data.identification_number,
          name:updateStudent.user_data.names,
          lastNames:updateStudent.user_data.last_names,
          email: updateStudent.user_data.email,
          prefixProfile: updateStudent.prefix_profile
        }
        setStudent(dataStudentLocalStorage)
        authStorage.setStudent(dataStudentLocalStorage)

      }else{
        toast.error(response.message || 'No se pudo actualizar tu información.');
      }


    }catch{
      toast.error('¡Algo salió mal! Intenta de nuevo más tarde.');

    }


  };

  return {
    // Valores que s.e colocarán en los inputs
    numIdentification:dataUser?.numIdentification,
    newName,
    newLastNames,
    email:dataUser?.email,
    // Funciones que controlarán los inputs
    setNewName,
    setNewLastNames,
    // Envío
    handleSubmitUpdate,
    // Estado de errores
    errors,
  };
}
