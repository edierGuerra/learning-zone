// Page que se encargar de mostrar dicho mensaje el cual indique se esta esperando que se clickee en el link que se envio al correo
import '../Styles/ConfirmEmail.css'
import useConfirmEmail from '../Hooks/useConfirmEmail'
import { useNavigationHandler } from '../../../hooks/useNavigationHandler'
import { useEffect } from 'react'
import DecayCard from '../../../shared/animations/DecayCard'
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import { authStorage } from '../../../shared/Utils/authStorage'

export default function ConfirmEmail() {

    const {message,success} = useConfirmEmail()
    const handleBtnNavigate = useNavigationHandler()

    // traer email del localstorage
    const email = authStorage.getEmail()

    useEffect(()=>{
        if(success){
            // Almacenar en el localstorage
            const timeOuth = setTimeout(()=>{
                handleBtnNavigate('/home')
            },2000)

            return () => clearTimeout(timeOuth);
        }

    },[success, handleBtnNavigate])



  return (
    <div className='container-confirm-email'>
                <DecayCard  width={1000} height={600} image="">
                    <div className="container-information-confirm">
                        <button className="btn-back-confirm" onClick={()=>handleBtnNavigate('/back')}>{<IoArrowBackCircleSharp/>}</button>
                        <h2 className='title-container-confim-email'>Confirmacion De cuenta</h2>
                        <p className='paragraph-description-confirm'>Hemos enviado un mensaje a tu correo electrónico <span>{email}</span>.
                        Por favor, dirígete a tu bandeja de entrada y haz clic en el enlace de confirmación para activar tu cuenta.</p>
                        {success && <p>{message}</p>} {/* En caso se muestra lo que dice el backend */}
                        {success && <p>Redirigiendo al Login</p> } {/* En caso se muestra redirijiendo al login si es true */}
                        {!success &&  message && <p>{message}</p>} {/* Mostrar error generico */}
                    </div>
                </DecayCard>


    </div>
  )
}
