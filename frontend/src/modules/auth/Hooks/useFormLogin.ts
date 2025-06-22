import { useState } from "react";
import { useNavigationHandler } from "../../../hooks/useNavigationHandler";
import type { TStudent } from "../../types/User";

export default function useFormLogin() {
  // --- Tipos de datos usados ---
  type LoginForm = Pick<TStudent, "email" | "password">;
  type FormErrors = Partial<Record<keyof LoginForm, string>>;

  const [email, setEmail] = useState<TStudent['email']>('');
  const [password, setPassword] = useState<TStudent['password']>('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleBtnNavigate = useNavigationHandler();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // --- Mensajes centralizados de error ---
  const ERROR_MESSAGES = {
    required: (field: string) => `El ${field} es obligatorio.`,
    invalidEmail: "El formato del correo electrónico no es válido.",
  };

  // --- Validadores unitarios ---
  const isRequired = (value: string): boolean => value.trim().length > 0;
  const isValidEmail = (email: string): boolean =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  // --- Validador principal del login ---
  const validateForm = (form: LoginForm): FormErrors => {
    const errors: FormErrors = {};

    if (!isRequired(form.email)) {
      errors.email = ERROR_MESSAGES.required("correo electrónico");
    } else if (!isValidEmail(form.email)) {
      errors.email = ERROR_MESSAGES.invalidEmail;
    }

    if (!isRequired(form.password)) {
      errors.password = ERROR_MESSAGES.required("contraseña");
    }

    return errors;
  };

  // --- Manejador del envío del login ---
  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData: LoginForm = { email, password };
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Aquí deberías llamar a tu servicio loginAPI(formData)
      console.log("Iniciando sesión con:", formData);
      // handleBtnNavigate('/dashboard');
    } catch{
      alert("No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    handleBtnNavigate,
    togglePasswordVisibility,
    handleSubmitLogin,
    loading,
    errors
  };
}
