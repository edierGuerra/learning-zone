import { useEffect, useState } from "react"
import Login from "../Components/Login";
import Register from "../Components/Register";
import '../Styles/LoginAndRegisterPage.css'
import { IoArrowBackCircleSharp } from "react-icons/io5";
//Efecto de scroll
import '../../../../node_modules/aos/dist/aos.css'
import AOS from 'aos';

import { useNavigationHandler } from "../../../hooks/useNavigationHandler";
type TPropsLoginAndregister ={
  opcAuth: true | false
}
export default function LoginAndRegister({opcAuth}:TPropsLoginAndregister) {
  console.log(opcAuth)
  const handleBtnNavigate = useNavigationHandler()



  const [clickOptionAuth, setClickOptionAuth] = useState(opcAuth);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });

    setTimeout(() => {
      AOS.refresh(); // recalcula los elementos visibles
    }, 100);
  }, [clickOptionAuth]);

  useEffect(()=>{
    setClickOptionAuth(opcAuth)
  }, [opcAuth])

  const handleClickOptionAuth =(click:boolean)=>{
    if(click){
      handleBtnNavigate('/login')


    }else if(!click){
      handleBtnNavigate('/register')
    }
    setClickOptionAuth(click)
  }

  return (
    <div className="container-login-register" >
      <button className="btn-back" onClick={()=>handleBtnNavigate('/')}>{<IoArrowBackCircleSharp/>}</button>

      <div className="container-auth" style={{'flexDirection':clickOptionAuth? 'row': "row-reverse"}}>
        {/* Contenedor que permite el efecto de deslizamiento */}
        <div className="section-slider-container">
          {/* Sección de login: activa si clickOptionAuth es true, inactiva si es false */}
          <section className={`section-information-login ${clickOptionAuth ? 'active' : 'inactive'}`}>
             <div className="container-info-login">
              <h2>Que gusto tenerte de nuevo!</h2>
              <p>Cada paso que das hoy te acerca a tus sueños. ¡Sigue adelante!</p>
            </div>
          </section>
          {/* Sección de registro: activa si clickOptionAuth es false, inactiva si es true */}
          <section className={`section-information-register ${!clickOptionAuth ? 'active' : 'inactive'}`}>
            <div className="container-info-register">
              <h2>Que esperas para registrate?</h2>
              <p>El conocimiento te transforma. Haz parte del cambio.</p>
            </div>

          </section>
        </div>
        {/* Sección de autenticación y botones */}
        <section data-aos={clickOptionAuth? 'fade-right': 'fade-left'} style={{'backgroundColor': clickOptionAuth? 'var(--color-dark-blue)':'var(--color-dark-gray-brown)'}} className="section-auth-all">

          <div className="container-opc-register-login">
            {/* Botón para mostrar el registro */}
            <button
              style={clickOptionAuth? {}: {'backgroundColor':'var(--color-vibrant-red-orange)','color':'#ffff'} }
              onClick={()=>handleClickOptionAuth(false)}
              className="btn-opc-login"
            >
              Sign Up
            </button>
            {/* Botón para mostrar el login */}
            <button
              style={clickOptionAuth?  {'backgroundColor':'var(--color-mint-green)','color':'#10101'} :{} }
              onClick={()=>handleClickOptionAuth(true)}
              className="btn-opc-register"
            >
              Sign In
            </button>
          </div>
          {/* Renderiza el formulario correspondiente */}
          {clickOptionAuth ? <Login/>:<Register/>}
        </section>
      </div>





    </div>
  )
}
