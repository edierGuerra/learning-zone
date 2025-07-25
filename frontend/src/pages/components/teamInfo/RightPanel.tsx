import "./styles/RightPanel.css";

type RightPanelProps = {
  onClose?: () => void;
};

export default function RightPanel({ onClose }: RightPanelProps) {
  return (
    <div className="panel-content-right">
      {/* ❌ Botón de cierre */}
      {onClose && (
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      )}

      <h2 className="panel-title">Sobre Nosotros</h2>
      <p className="panel-description">
        Somos un equipo de desarrolladores conformado por aprendices del programa Análisis y Desarrollo de Software del SENA. 
        Nacemos como una iniciativa formativa con el objetivo de aplicar nuestros conocimientos
        en la creación de soluciones tecnológicas funcionales, accesibles e innovadoras.
      </p>

      <div className="panel-section">
        <h3>Habilidades:</h3>
        <ul className="panel-list">
          <li>Diseño UI/UX</li>
          <li>Gestión de proyectos</li>
          <li>Autenticación y control</li>
          <li>Accesibilidad web</li>
        </ul>
      </div>
    </div>
  );
}
