import './styles/Help.css';
import FloatingArrow from './FloatingArrow';
import HelpButtons from './HelpButtons';
import wordImg from '../../assets/courses/word.png';
import excelImg from '../../assets/courses/excel.png';
import pointImg from '../../assets/courses/powerpoint.png';

type HelpSlideProps = {
  index: number;
  setIndex: (i: number) => void;
  onSkip: () => void;
};

const helpSteps = [
  {
    text: "LOGO REPRESENTATIVO.",
    arrow: { top: "0px", left: "3px", rotation: "90deg", zIndex: 9999 },
  },
  {
    text: "APARTADO DE CATEGORÍA EN DONDE ESTÁN LOS CURSOS: EXCEL, WORD Y POWERPOINT",
    arrow: { top: "0px", left: "72%", rotation: "90deg", zIndex: 9999 },
  },
  {
    text: "APARTADO DE NOTIFICACIONES: INFORMACIÓN IMPORTANTE.",
    arrow: { top: "2px", left: "81%", rotation: "90deg", zIndex: 9999 },
  },
  {
    text: "PERFIL: PROGRESO DEL USUARIO Y EDICIÓN DE INFORMACIÓN.",
    arrow: { top: "2px", left: "86%", rotation: "90deg", zIndex: 9999},
  },
  {
    text: "ÍCONO DE AYUDAS.",
    arrow: { top: "0px", left: "77%", rotation: "90deg", zIndex: 9999 },
  },
  {
    text: "FOOTER.",
    arrow: { top: "750px", left: "65%", rotation: "320deg", zIndex: 9999 },
  },
  {
    text: "WORD, EXCEL Y POWER POINT SON CURSOS Y ESTARAN COMPUESTOS POR LECCIONES .",
    arrow: { top: "400px", left: "90%", rotation: "2deg", zIndex: 9999},
  },
];

export default function HelpSlide({ index, setIndex, onSkip }: HelpSlideProps) {
  const { text, arrow } = helpSteps[index];

  return (
    <>
      <div className="help-slide">
        <br />
        <h1 className="titulo">Bienvenido JH</h1>
        <p className="parrafo">Selecciona un curso para comenzar</p>
        <br />
        <br />

        <div className="carta-container">
          <div className="carta-card-word">
            <img className="imagen" src={wordImg} alt="Word" />
            <h3>Word</h3>
            <p>Curso básico de Word para crear documentos</p>
          </div>

          <div className="carta-card-excel">
            <img className="imagen" src={excelImg} alt="Excel" />
            <h3>Excel</h3>
            <p>Curso básico de Excel para manipular datos</p>
          </div>

          <div
            className={`carta-card-power ${index === 6 ? 'highlight no-shadow' : ''}`}
            style={index === 6 ? { position: 'relative', zIndex: 9999 } : {}}
          >
            <img className="imagen" src={pointImg} alt="PowerPoint" />
            <h3>Power Point</h3>
            <p>Curso básico de Power Point para crear presentaciones</p>
          </div>
        </div>

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

    </>
  );
}
