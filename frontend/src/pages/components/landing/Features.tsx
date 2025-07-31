import { useEffect, /* useState */ } from 'react';
import TiltedCard from '../../../shared/animations/AnimationCard'
import './styles/Features.css'
/* import ConfettiExplosion from "react-confetti-explosion"; */
import '../../../../node_modules/aos/dist/aos.css'
import AOS from 'aos';
import image1 from '../../assets/Features/laboral.jpeg'
import image2 from '../../assets/Features/image.png'
import image3 from '../../assets/Features/descarga.jpeg'
import image4 from '../../assets/Features/imageinstitution1.jpg'
import image5 from '../../assets/Features/colab2.jpg'
import image6 from '../../assets/Features/educacion-herramientas-infantiles-centradas-futuro-aprendizaje-equipos-educativos-redes-sociales-po_795881-30524.avif'

export default function Features() {

useEffect(() => {
  AOS.init({
    duration: 1000,
    once: false, // solo una vez
  });

  setTimeout(() => {
    AOS.refresh(); // recalcula los elementos visibles
  }, 100);
}, []);


/*   const handleClickBtnView =()=>{
    setIsExploding(true)
    setTimeout(() => setIsExploding(false), 1000);
    handleBtnNavigate('/home')

} */
  return (
    <div data-aos="fade-up" className='section-feaures'>
      <section className='section-features-title'>
        <span className='title-features-smalll'>Caracteristicas</span>
        <h2 className='title-features-big'>Que te harán resaltar</h2>
      </section>
      <span className='divid'></span>

      <section className='features'>
        <div className="feature-card">
          <h2 className='title-feature'>Prepara para mundo laboral - universitario</h2>
          <TiltedCard
          imageSrc={image1}
          altText="Kendrick Lamar - GNX Album Cover"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="300px"
          rotateAmplitude={12}
          scaleOnHover={1.1}
          showMobileWarning={false}
          displayOverlayContent={false}
          overlayContent={
            <p className="tilted-card-demo-text">
              Kendrick Lamar - GNX
            </p>
          }
          />
        </div>
        <div className="feature-card">
          <h2 className='title-feature'>Organización de la información</h2>
          <TiltedCard
          imageSrc={image2}
          altText="Kendrick Lamar - GNX Album Cover"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="300px"
          rotateAmplitude={12}
          scaleOnHover={1.1}
          showMobileWarning={false}
          displayOverlayContent={false}
          overlayContent={
            <p className="tilted-card-demo-text">
              Kendrick Lamar - GNX
            </p>
          }
          />
        </div>
        <div className="feature-card">
          <h2 className='title-feature'>Domina el manejo de datos e ideas</h2>
          <TiltedCard
          imageSrc={image3}
          altText="Kendrick Lamar - GNX Album Cover"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="300px"
          rotateAmplitude={12}
          scaleOnHover={1.1}
          showMobileWarning={false}
          displayOverlayContent={false}
          overlayContent={
            <p className="tilted-card-demo-text">
              Kendrick Lamar - GNX
            </p>
          }
          />
        </div>

        <div className="feature-card">
          <h2 className='title-feature'>Trabajo colaborativo en documentos compartidos</h2>
          <TiltedCard
          imageSrc={image4}
          altText="Kendrick Lamar - GNX Album Cover"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="270px"
          rotateAmplitude={12}
          scaleOnHover={1.1}
          showMobileWarning={false}
          displayOverlayContent={false}
          overlayContent={
            <p className="tilted-card-demo-text">
              Kendrick Lamar - GNX
            </p>
          }
          />
        </div>
        <div className="feature-card">
          <h2 className='title-feature'>Éxito garantizado trabajando de la mano con herramientas digitales</h2>
          <TiltedCard
          imageSrc={image5}
          altText="Kendrick Lamar - GNX Album Cover"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="270px"
          rotateAmplitude={12}
          scaleOnHover={1.1}
          showMobileWarning={false}
          displayOverlayContent={false}
          overlayContent={
            <p className="tilted-card-demo-text">
              Kendrick Lamar - GNX
            </p>
          }
          />

        </div>
        <div className="feature-card">
          <h2 className='title-feature'>Transforma información en conocimiento útil</h2>
          <TiltedCard
          imageSrc={image6}
          altText="Kendrick Lamar - GNX Album Cover"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="300px"
          rotateAmplitude={12}
          scaleOnHover={1.1}
          showMobileWarning={false}
          displayOverlayContent={false}
          overlayContent={
            <p className="tilted-card-demo-text">
              Kendrick Lamar - GNX
            </p>
          }
            />
            </div>
      </section>

    </div>
  )
}
