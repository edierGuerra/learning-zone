import "./styles/LeftPanel.css"
export default function LeftPanel() {
  return (
      <div className="panel-content-left">
        <div>
          <h2 className="panel-title">CJE TECNOLOGY</h2>
          <p className="panel-subtitle">¿Qué es?</p>
          <p className="panel-description">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim ullam
            facilis aliquam consequatur adipisci! Lorem ipsum dolor sit, amet
            consectetur adipisicing elit.
          </p>

          <div className="panel-section">
            <h3>Servicios</h3>
            <ul className="panel-list">
              <li>➤ Lorem ipsum dolor sit, am</li>
              <li>➤ Lorem ipsum dolor sit, am</li>
              <li>➤ Lorem ipsum dolor sit, am</li>
            </ul>
          </div>
        </div>

        <div className="panel-info-place">
          <span>📍</span> Medellín, Colombia
        </div>
      </div>

  );
}
