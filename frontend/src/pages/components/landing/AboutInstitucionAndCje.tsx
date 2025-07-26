import CircularGallery from '../../../shared/animations/CircularGalery'
import './styles/AboutInstitucionAndCje.css'
//imagenes team cje
import imgCharif from '../../../assets/cjeTect/img-charif.jpg';
import imgEdier from '../../../assets/cjeTect/img-edier.jpg';
import imgCamilo from '../../../assets/cjeTect/img-camilo.jpg';
import imgJunior from '../../../assets/cjeTect/img-junior.jpg';
import imageinstitution1 from '../../../assets/juanTamayo/PHOTO-2022-10-04-10-30-36.jpg'
import imageinstitution2 from '../../../assets/juanTamayo/Captura de pantalla 2025-07-26 001752.png'
import imageinstitution3 from '../../../assets/juanTamayo/ier.jpg'
import imageinstitution4 from '../../../assets/juanTamayo/iru.jpg'

//imagenes ier

import '../../../../node_modules/aos/dist/aos.css'
import AOS from 'aos';
import { useEffect } from 'react';
import { useNavigationHandler } from '../../../hooks/useNavigationHandler';

export default function AboutInstitucionAndCje() {
  const handleBtnNavigate =useNavigationHandler();
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false, // solo una vez
    });

    setTimeout(() => {
      AOS.refresh(); // recalcula los elementos visibles
    }, 100);
  }, []);
const partsDevelopment ={
    'Frontend':`Frontend`,
    'Backend':`Backend`
  }

const itemsCje = [
  { image: imgCharif, text:`Charif - ${partsDevelopment.Frontend}`},
  { image: imgEdier, text: `Edier - ${partsDevelopment.Backend}` },
  { image: imgCamilo, text: `Camilo - ${partsDevelopment.Backend}` },
  { image: imgJunior, text: `Junior - ${partsDevelopment.Frontend}` },
];
const itemsIer = [
  { image: imageinstitution1 , text:`Mochilas llenas de sueños.`},
  { image: imageinstitution2, text: `Educación que inspira sonrisas. `},
  { image: imageinstitution3, text: `Aquí empieza el futuro. `},
  { image: imageinstitution4, text: `Educación con alegría.` },
];

  return (
    <div data-aos="zoom-in-down" className="container-about-institucion-and-cje">
      <h2 className='title-about-landing'>Acerca de</h2>
      <div className="container-all-about">
          <div className='container-landing-team' style={{ height: '600px', position: 'relative' }}>
            <h2 className='title-landing-team'>Team Cje-Tec</h2>
            <div data-aos="zoom-out-right" className='gallery-wrapper' >
                <CircularGallery
                items={itemsCje}
                bend={.1}
                textColor="#9bc1f9"
                borderRadius={.04}
              />
            </div>
            <button onClick={()=>handleBtnNavigate('/aboutUs')}className='btn-view-about-team'>Ver Mas</button>
        </div>
        <div className="container-landing-institution" style={{ height: '600px', position: 'relative' }}>
            <h2 className='title-landing-institution'>I.E.R Juan Tamayo</h2>
              <div data-aos="zoom-out-left" className='gallery-wrapper' >
                <CircularGallery
                  items={itemsIer}
                  bend={.1}
                  textColor="#fd4"
                  borderRadius={.04}
                />
              </div>
            <button onClick={()=>handleBtnNavigate('/aboutInstitution')} className='btn-view-about-institution'>Ver Mas</button>
        </div>
      </div>


    </div>

  )

}
