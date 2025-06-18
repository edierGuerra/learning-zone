import { useEffect, useState } from 'react';
import TiltedCard from '../../../shared/animations/AnimationCard'
import './styles/Features.css'
import ConfettiExplosion from "react-confetti-explosion";
import '../../../../node_modules/aos/dist/aos.css'
import AOS from 'aos';
export default function Features() {
  const [isExploding, setIsExploding] = useState(false);

useEffect(() => {
  AOS.init({
    duration: 1000,
    once: false, // solo una vez
  });

  setTimeout(() => {
    AOS.refresh(); // recalcula los elementos visibles
  }, 100);
}, []);


const handleClickBtnView =()=>{
  setIsExploding(true)
   setTimeout(() => setIsExploding(false), 1000);

}
  return (
    <div data-aos="fade-up" className='section-feaures'>
      <section className='section-features-title'>
        <span className='title-features-smalll'>Caractacteristicas</span>
        <h2 className='title-features-big'>Que te haran Resaltar</h2>
      </section>
      <span className='divid'></span>

      <section className='features'>
        <div className="feature-card">
          <h2 className='title-feature'>Organización de la información</h2>
          <TiltedCard
          imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
          altText="Kendrick Lamar - GNX Album Cover"
          captionText="Kendrick Lamar - GNX"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="300px"
          rotateAmplitude={12}
          scaleOnHover={1.1}
          showMobileWarning={false}
          showTooltip={true}
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
          captionText="Kendrick Lamar - GNX"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="300px"
          rotateAmplitude={12}
          scaleOnHover={1.1}
          showMobileWarning={false}
          showTooltip={true}
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
          captionText="Kendrick Lamar - GNX"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="300px"
          rotateAmplitude={12}
          scaleOnHover={1.1}
          showMobileWarning={false}
          showTooltip={true}
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
          captionText="Kendrick Lamar - GNX"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="300px"
          rotateAmplitude={12}
          scaleOnHover={1.1}
          showMobileWarning={false}
          showTooltip={true}
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
          captionText="Kendrick Lamar - GNX"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="270px"
          rotateAmplitude={12}
          scaleOnHover={1.1}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={false}
          overlayContent={
            <p className="tilted-card-demo-text">
              Kendrick Lamar - GNX
            </p>
          }
          />
        </div>
        <div className="feature-card-btn">
          <div className='div-card-top'>Que esperas</div>
            

          <button onClick={handleClickBtnView}>Continuar</button>
        {isExploding && (
            <div style={{ position: "relative", top: "-10%", left: "94%", transform: "translateX(-50%)" }}>
              <ConfettiExplosion
                particleCount={650}
                duration={8000}
                force={.4}
                width={2000}
                zIndex={2000}
                colors={["#D4AF37", "#800020", "#ffffff"]}
              />
            </div>
          )}
          <div className='div-card-button'>Para empezar</div>
        </div>
      
 

      </section>



  
      
    </div>
  )
}
