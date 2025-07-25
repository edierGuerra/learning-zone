import { useEffect, useState } from "react";
import './styles/Help.css';
import FloatingArrow from './FloatingArrow';
import HelpButtons from './HelpButtons';
import Home from '../../../modules/dashboard/pages/Home';

type HelpSlideProps = {
  index: number;
  setIndex: (i: number) => void;
  onSkip: () => void;
};

// Hook para detectar si es móvil
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

export default function HelpSlide({ index, setIndex, onSkip }: HelpSlideProps) {
  const isMobile = useIsMobile();

  const helpSteps = [
    {
      text: "LOGO REPRESENTATIVO.",
      arrow: isMobile
        ? { top: "1.5vh", left: "44vw", rotation: "90deg", color: "black" }
        : { top: "1vh", left: "2vw", rotation: "90deg", color: "white" },
    },
    {
      text: "APARTADO DE CATEGORÍA EN DONDE ESTÁN LOS CURSOS...",
      arrow: isMobile
        ? { top: "2vh", left: "25vw", rotation: "90deg" }
        : { top: "1vh", left: "54vw", rotation: "90deg" },
    },
    {
      text: "APARTADO DE NOTIFICACIONES: INFORMACIÓN IMPORTANTE.",
      arrow: isMobile
        ? { top: "2vh", left: "55vw", rotation: "90deg" }
        : { top: "1vh", left: "70vw", rotation: "90deg" },
    },
    {
      text: "PERFIL: PROGRESO DEL USUARIO Y EDICIÓN DE INFORMACIÓN.",
      arrow: isMobile
        ? { top: "2vh", left: "75vw", rotation: "90deg" }
        : { top: "1vh", left: "79vw", rotation: "90deg" },
    },
    {
      text: "ÍCONO DE AYUDAS.",
      arrow: isMobile
        ? { top: "2vh", left: "41vw", rotation: "90deg" }
        : { top: "1vh", left: "62vw", rotation: "90deg" },
    },
    {
      text: "FOOTER.",
      arrow: isMobile
        ? { top: "100vh", left: "30vw", rotation: "320deg" }
        : { top: "85vh", left: "65vw", rotation: "320deg" },
    },
    {
      text: "WORD, EXCEL Y POWER POINT SON CURSOS Y ESTARÁN COMPUESTOS POR LECCIONES.",
      arrow: isMobile
        ? { top: "62vh", left: "78vw", rotation: "2deg" }
        : { top: "60vh", left: "90vw", rotation: "2deg" },
    },
  ];

  const currentStep = helpSteps[index];
  const arrow = {
    ...currentStep.arrow,
    zIndex: 9999,
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '112vh' }}>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 0,
          overflow: 'hidden',
          filter: 'blur(1.5px)',
          pointerEvents: 'none',
        }}
      >
        <Home />
      </div>

      <div className="help-slide" style={{ position: 'relative', zIndex: 10 }}>
        <div className="help-overlay">
          <div className="help-box">
            <p className="help-text">{currentStep.text}</p>
            <HelpButtons
              isLast={index === helpSteps.length - 1}
              onNext={() => setIndex(index + 1)}
              onSkip={onSkip}
            />
          </div>
        </div>
        <FloatingArrow {...arrow} />
      </div>
    </div>
  );
}
