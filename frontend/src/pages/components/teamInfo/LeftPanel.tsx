import "./styles/LeftPanel.css";

type LeftPanelProps = {
  onClose?: () => void;
};

export default function LeftPanel({ onClose }: LeftPanelProps) {
  return (
    <div className="panel-content-left">
      {onClose && (
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      )}

      <div>
        <h2 className="panel-title">CJE TECNOLOGY</h2>
        <p className="panel-subtitle">¿Qué es?</p>
        <p className="panel-description">
          CJE Technology es una iniciativa académica conformada por aprendices del SENA,
          orientada al desarrollo de soluciones tecnológicas con fines educativos y sociales.
          A través del trabajo colaborativo, aplicamos conocimientos en programación, diseño y análisis
          para construir plataformas digitales innovadoras, con compromiso, creatividad y buenas prácticas de desarrollo.
        </p>

        <div className="panel-section">
          <h3>Servicios</h3>
          <ul className="panel-list">
            <li>➤ Gestión de contenido educativo</li>
            <li>➤ Seguridad de datos</li>
            <li>➤ Navegación guiada e intuitiva</li>
          </ul>
        </div>
      </div>

      <div className="panel-info-place">
        <span>📍</span> Medellín, Colombia
      </div>
    </div>
  );
}
