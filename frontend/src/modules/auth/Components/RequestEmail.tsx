/* Componente que solicita el email */
import '../Styles/RequestEmail.css'
import  { useEffect } from 'react'
import SucessMessage from '../Components/SucessMessage';
import useRecoverPassword from '../Hooks/useRecoverPassword';

export default function RequestEmail() {
    const {
        email,
        setEmail,
        errors,
        viewSucessMessage,
        handleSubmitRequestEmail,
  } = useRecoverPassword();



    useEffect(() => {
        if (viewSucessMessage) {
          const timeout = setTimeout(() => {
            window.location.href = '/confirmEmailRequest'
          }, 3000);
    
          return () => clearTimeout(timeout); // limpieza si desmonta antes
        }
      }, [viewSucessMessage]);


  return (
    <form className='form-email-request' onSubmit={(e)=>handleSubmitRequestEmail(e)}>
      <h2 className='title-Request-email'>Ingresa tu correo electrónico</h2>
        <div className="container-label-input-r">
          <input
              type="email"
              id="email"
              value={email}
              className={email ? 'has-content' : ''} // Añade clase si tiene contenido
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <input className='btn-email-verify' type="submit" value={'Verificar'} />
        {viewSucessMessage && (
        <SucessMessage name='Verificacion'/>
        )}
    </form>
  )
}
