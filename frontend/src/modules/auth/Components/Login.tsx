import '../Styles/Login.css'; // Asegúrate de que este archivo exista
// importando iconos
/* import { GrView } from 'react-icons/gr';
import { GrFormViewHide } from 'react-icons/gr'; */
import useFormLogin from '../Hooks/useFormLogin';
import { useEffect } from 'react';

export default function Login() {
  const {email,
      setEmail,
      password,
      setPassword,
      showPassword,
      handleBtnNavigate,
      /* togglePasswordVisibility, */
      handleSubmitLogin, errors, viewSucessMessage} = useFormLogin()

  useEffect(() => {
    if (viewSucessMessage) {
      const timeout = setTimeout(() => {
        window.location.href = '/';
      }, 3000);

      return () => clearTimeout(timeout); // limpieza si desmonta antes
    }
  }, [viewSucessMessage]);



  return (
    <>
    {viewSucessMessage? (
      <>
        <form className='form-login' onSubmit={(e) => handleSubmitLogin(e)}>
          <h2 className='title-login'>Sign In</h2>

          {/* Contenedor para el Email */}
          <div className="container-label-input-l">
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

          {/* Contenedor para la Contraseña */}
          <div className="container-label-input-l">
            <input
              type={'password'}
              id="password"
              className={password ? 'has-content' : ''} // Añade clase si tiene contenido
              value={password} // Controla el valor
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            {errors.password && <span className="error">{errors.password}</span>}

            {/* Mueve el icono de la contraseña aquí para que esté dentro del contenedor del input */}
          {/*   <span className='icon-show' onClick={togglePasswordVisibility}>
              {showPassword ? <GrView /> : <GrFormViewHide />}
            </span> */}
          </div>
          <p className='paragraph-forgot-a' onClick={()=>handleBtnNavigate('/emailNewPassword')}>Forgot password</p>
          <input className='btn-login' type="submit" value={'Login'} />
          <p onClick={()=>handleBtnNavigate('/register')} className='paragraph-create-account'>Don´t have an Account <a>Register</a></p>
          <a onClick={()=>handleBtnNavigate('/sitePolicies')}  className='paragraph-policies-login'>Términos y condiciones Política de Privacidad</a>
        </form>


      </>


    ):
      <form className='form-login' onSubmit={(e) => handleSubmitLogin(e)}>
        <h2 className='title-login'>Sign In</h2>

        {/* Contenedor para el Email */}
        <div className="container-label-input-l">
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

        {/* Contenedor para la Contraseña */}
        <div className="container-label-input-l">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className={password ? 'has-content' : ''} // Añade clase si tiene contenido
            value={password} // Controla el valor
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          {errors.password && <span className="error">{errors.password}</span>}

          {/* Mueve el icono de la contraseña aquí para que esté dentro del contenedor del input */}
        {/*   <span className='icon-show' onClick={togglePasswordVisibility}>
            {showPassword ? <GrView /> : <GrFormViewHide />}
          </span> */}
        </div>
        <p className='paragraph-forgot-a' onClick={()=>handleBtnNavigate('/emailNewPassword')}>Forgot password</p>
        <input className='btn-login' type="submit" value={'Login'} />
        <p onClick={()=>handleBtnNavigate('/register')} className='paragraph-create-account'>Don´t have an Account <a>Register</a></p>
        <a onClick={()=>handleBtnNavigate('/sitePolicies')}  className='paragraph-policies-login'>Términos y condiciones Política de Privacidad</a>
      </form>


  }


    </>

  );
}
