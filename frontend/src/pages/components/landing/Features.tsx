import { useEffect, /* useState */ } from 'react';
import TiltedCard from '../../../shared/animations/AnimationCard'
import './styles/Features.css'
/* import ConfettiExplosion from "react-confetti-explosion"; */
import '../../../../node_modules/aos/dist/aos.css'
import AOS from 'aos';
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
        <h2 className='title-features-big'>Que te haran Resaltar</h2>
      </section>
      <span className='divid'></span>

      <section className='features'>
        <div className="feature-card">
          <h2 className='title-feature'>prepara para mundo laboral - universitario</h2>
          <TiltedCard
          imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
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
          imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
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
          imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
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
          imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
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
          <h2 className='title-feature'>Trabajo colaborativo en documentos compartidos</h2>
          <TiltedCard
          imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
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
      </section>





    </div>
  )
}
