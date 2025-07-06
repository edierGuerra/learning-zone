import { useEffect } from 'react';
import iconVerifed from '../../../assets/learningZone/verificado.gif';
import '../Styles/SuccessMessage.css';

type TSuccessMessageProps = {
  name: 'Login' | 'Registro' | 'Verificacion' | 'Contraseña';
};

export default function SucessMessage({ name }: TSuccessMessageProps) {
  useEffect(() => {
    const el = document.querySelector('.container-SuccessMessage');
    if (el) {
      el.classList.remove('container-SuccessMessage');
      void el; // Fuerza recalculo de estilo
      el.classList.add('container-SuccessMessage');
    }
  }, []);

  return (
    <div className="container-SuccessMessage">
      <p className="success-message">
        {name} {name === 'Registro' || name === 'Login'  || name=== 'Contraseña'? 'Exitoso' : 'Exitosa'}
      </p>
      <img className="icon-verifed" src={iconVerifed} alt="icon-verifed" />
    </div>
  );
}
