/* Hook que agrupa la lógica para actualizar datos del estudiante */

import React, { useState, useEffect } from 'react';
import type { TStudent, TStudentProfile } from '../../types/User';
import { authStorage } from '../../../shared/Utils/authStorage';

export default function useFormUpdate() {
  // --- Tipos usados para validación ---
  type UpdateForm = {
    numIdentification: TStudent['numIdentification'];
    name: TStudent['name'];
    lastNames: TStudent['lastNames'];
    email: TStudent['email'];
  };

  // permite tener un error por cada campo (o ninguno)
  type FormErrors = Partial<Record<keyof UpdateForm, string>>;

  // --- Constantes de validación ---
  const MIN_NIDENTIFICATION = 10;

  // --- Mensajes centralizados para reutilización y claridad ---
  const ERROR_MESSAGES = {
    required: (field: string) => `El ${field} es obligatorio.`,
    invalidEmail: "El formato del correo electrónico no es válido.",
    minLength: (field: string, length: number) => `La ${field} debe tener al menos ${length} caracteres.`,
  };

  // --- Validadores reutilizables (unitarios) ---
  const isRequired = (value: string): boolean => value.trim().length > 0;

  const isValidEmail = (email: string): boolean =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const hasMinLength = (value: string, min: number): boolean =>
    value.length >= min;

  // --- Validador principal del formulario ---
  const validateForm = (form: UpdateForm): FormErrors => {
    const errors: FormErrors = {};

    if (!form.numIdentification || !hasMinLength(form.numIdentification.toString(), MIN_NIDENTIFICATION)) {
      errors.numIdentification = ERROR_MESSAGES.minLength("número de identificación", MIN_NIDENTIFICATION);
    }

    if (!isRequired(form.name)) {
      errors.name = ERROR_MESSAGES.required("nombre");
    }

    if (!isRequired(form.lastNames)) {
      errors.lastNames = ERROR_MESSAGES.required("apellidos");
    }

    if (!isRequired(form.email)) {
      errors.email = ERROR_MESSAGES.required("correo electrónico");
    } else if (!isValidEmail(form.email)) {
      errors.email = ERROR_MESSAGES.invalidEmail;
    }

    return errors;
  };

  // --- Estados del formulario ---
  const [newNIdentification, setNewNIdentification] = useState<TStudent['numIdentification']>();
  const [newName, setNewName] = useState<TStudent['name']>(''); // Inicializa con cadena vacía
  const [newLastNames, setNewLastNames] = useState<TStudent['lastNames']>(''); // Inicializa con cadena vacía
  const [newEmail, setNewEmail] = useState<TStudent['email']>(''); // Inicializa con cadena vacía
  const [errors, setErrors] = useState<FormErrors>({}); // Almacena errores del formulario

  // --- Efecto que carga los datos desde el localStorage una vez ---
  useEffect(() => {
    const dataUser: TStudentProfile | null = authStorage.getUser();

    if (dataUser !== null) {

      setNewNIdentification(dataUser.numIdentification);
      setNewName(dataUser.name);
      setNewLastNames(dataUser.lastNames);
      setNewEmail(dataUser.email);
    } else {
      alert('Lo sentimos pero no puedes actualizar la información');
    }
  }, []);

  // --- Envío del formulario ---
  const handleSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData: UpdateForm = {
      numIdentification: newNIdentification!,
      name: newName,
      lastNames: newLastNames,
      email: newEmail,
    };

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Si hay errores → los muestra
      return; // Detiene el envío
    }

    // Aquí iría la lógica para enviar los datos a la API
    // Aqui se valida que si halla cambiado algo
    if(formData === formData){
        alert('Parece que no has actualizado nada')
        return
    }
    else{
        //Envio de datos al backend
    }

    alert('Formulario actualizado correctamente');
  };

  return {
    // Valores que s.e colocarán en los inputs
    newNIdentification,
    newName,
    newLastNames,
    newEmail,
    // Funciones que controlarán los inputs
    setNewNIdentification,
    setNewName,
    setNewLastNames,
    setNewEmail,
    // Envío
    handleSubmitUpdate,
    // Estado de errores
    errors,
  };
}
