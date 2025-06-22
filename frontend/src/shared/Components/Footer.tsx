import iconLz from '../../assets/learningZone/icon-learning-zone.jpg'
import iconIER from '../../assets/juanTamayo/icon-institucion.png'
// icons de react icons
import { FaTiktok } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FiGithub } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
//Style
import './Styles/Footer.css'
// navegacion
import { useNavigate } from 'react-router-dom';
export default function Footer() {
  const navigate = useNavigate();
  const handleClickPolicies =()=>{
    navigate('/sitePolicies')
  }

  return (
    <footer>
        <section className='contenedor-1'>
          <div className="container-nombre">
            <h2>Learning Zone</h2>
            <img src={iconLz} alt="" />
          </div>
          <div className="contendor-ubi">
            {<IoLocationOutline className='icon iconUbi'/>}
            <p>Alfonso L</p>
          </div>
          
        </section>
        <section className="contenedor-2">
            <div className="contenedor-terminos-condiciones">
              <p>Copyright © 2025 © Cje-Tecnology inc. Todos los derechos reservados</p>
              <div className="container-all-t-p">
                <p onClick={handleClickPolicies}>Términos y condiciones   |   Políticas y Privacidad</p>
              </div>
            </div>

            <div className="contenedor-institucion">
              <h3>I.E.R Juan Tamayo</h3>
              <img src={iconIER} alt="" />
            </div>
            <div className="contenedor-redes">
              <ul>
                <li className="tikTok">{<FaTiktok className='icon' />}</li>
                <li className="facebook">{<FaFacebookF className='icon' />}</li>
                <li className="instagram">{<FaInstagram className='icon' />}</li>
                <li className="gitHub">{<FiGithub className='icon' />}</li>
              </ul>
            </div>
        </section>
    </footer>
  )
}
