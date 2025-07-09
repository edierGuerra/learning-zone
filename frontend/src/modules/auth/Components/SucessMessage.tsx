/* import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import '../Styles/SuccessMessage.css';

type TSuccessMessageProps = {
  name: 'Login' | 'Registro' | 'Verificacion' | 'Contraseña';
};

export default function SuccessMessage({ name }: TSuccessMessageProps) {
  useEffect(() => {
    toast.success(
      `${name} ${
        name === 'Registro' || name === 'Login' || name === 'Contraseña'
          ? 'Exitoso'
          : 'Exitosa'
      }`
    );
  }, [name]);

  return null; // no necesita renderizar nada visual
}
 */