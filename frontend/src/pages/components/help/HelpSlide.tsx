import './styles/Help.css';
import FloatingArrow from './FloatingArrow';
import HelpButtons from './HelpButtons';
import Home from '../../../modules/dashboard/pages/Home'; // ✅ Asegúrate de que esta ruta sea correcta

type HelpSlideProps = {
  index: number;
  setIndex: (i: number) => void;
  onSkip: () => void;
};

const helpSteps = [
  {
    text: "LOGO REPRESENTATIVO.",
    arrow: { top: "0px", left: "28px", rotation: "90deg", zIndex: 9999 },
  },
  {
    text: "APARTADO DE CATEGORÍA EN DONDE ESTÁN LOS CURSOS: EXCEL, WORD Y POWERPOINT",
    arrow: { top: "0px", left: "65%", rotation: "90deg", zIndex: 9999 },
  },
  {
    text: "APARTADO DE NOTIFICACIONES: INFORMACIÓN IMPORTANTE.",
    arrow: { top: "2px", left: "77%", rotation: "90deg", zIndex: 9999 },
  },
  {
    text: "PERFIL: PROGRESO DEL USUARIO Y EDICIÓN DE INFORMACIÓN.",
    arrow: { top: "2px", left: "84%", rotation: "90deg", zIndex: 9999 },
  },
  {
    text: "ÍCONO DE AYUDAS.",
    arrow: { top: "0px", left: "71%", rotation: "90deg", zIndex: 9999 },
  },
  {
    text: "FOOTER.",
    arrow: { top: "645px", left: "65%", rotation: "320deg", zIndex: 9999 },
  },
  {
    text: "WORD, EXCEL Y POWER POINT SON CURSOS Y ESTARAN COMPUESTOS POR LECCIONES .",
    arrow: { top: "400px", left: "90%", rotation: "2deg", zIndex: 9999 },
  },
];

export default function HelpSlide({ index, setIndex, onSkip }: HelpSlideProps) {
  const { text, arrow } = helpSteps[index];

  return (
    <div style={{ position: 'relative', width: '100%', height: '112vh' }}>
      {/* Fondo del componente Home */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 0,
          overflow: 'hidden',
          filter: 'blur(1.5px)' ,
          pointerEvents: 'none'
        }}
      >
        <Home/>
      </div>

   
      <div className="help-slide" style={{ position: 'relative', zIndex: 10 }}>
        <div className="help-overlay">
          <div className="help-box">
            <p className="help-text">{text}</p>
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

