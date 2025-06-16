import iconLz from '../../assets/learningZone/icon-learning-zone.jpg'
import iconIER from '../../assets/juanTamayo/icon-institucion.png'
import './Styles/Footer.css'
export default function Footer() {
  return (
    <footer>
        <section className='contenedor-1'>
          <div className="container-nombre">
            <h2>Learning Zone</h2>
            <img src={iconLz} alt="" />
          </div>
          <div className="contendor-ubi">
            {/* <img src={icon} alt="" /> */}
            <p>Alfonso L</p>
          </div>
          
        </section>
        <section className="contenedor-2">
            <div className="contenedor-terminos-condiciones">
              <h3>Copyright</h3>
              <div className="contenedor-terminos-politicas">
                <p>Copyright © 2025 © Cje-Tecnology inc. Todos los derechos reservados</p>
              </div>
            </div>
            <div className="contenedor-institucion">
              <h3>I.E.R Juan Tamayo</h3>
              <img src={iconIER} alt="" />
            </div>
            <div className="contenedor-redes">
              <ul>
                <li className="itemRed tikTok">Tik Tok</li>
                <li className="itemRed facebook">Facebook</li>
                <li className="itemRed instagram">Instagram</li>
              </ul>
            </div>
        </section>
    </footer>
  )
}
