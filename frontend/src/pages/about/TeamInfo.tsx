import { useState } from "react";
import aboutImage from "../../assets/cjeTect/Team.jpg";
import "../about/styles/TeamInfo.css";
import RightPanel from "../components/teamInfo/RightPanel";
import LeftPanel from "../components/teamInfo/LeftPanel";
import LearningZoneInfo from "../components/teamInfo/LearningZoneInfo";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa";

export const AboutUs = () => {
  // Estados para controlar los paneles laterales y el contenido central
  const [leftPanel, setLeftPanel] = useState(false);
  const [rightPanel, setRightPanel] = useState(false);
  const [showLearningZoneInfo, setShowLearningZoneInfo] = useState(false);

  // Ver panel izquierdo, asegurando que el derecho se cierre
  const toggleLeftPanel = () => {
    setLeftPanel(!leftPanel);
    setRightPanel(false);
  };

  // Ver panel derecho, asegurando que el izquierdo se cierre
  const toggleRightPanel = () => {
    setRightPanel(!rightPanel);
    setLeftPanel(false);
  };

  // Al ver la vista learning zone se cierran los paneles laterales
  const toggleLearningZoneInfo = () => {
    setShowLearningZoneInfo(!showLearningZoneInfo);
    setLeftPanel(false);
    setRightPanel(false);
  };

  return (
    <div className="about-us-container">
      {/* Botón izquierdo: solo aparece si no se está viendo el texto de Learning Zone */}
      {!showLearningZoneInfo && (
        <button
          className={`icon-button left ${leftPanel ? "above-panel" : ""}`}
          onClick={toggleLeftPanel}
        >
          {/* Cambia el icono según el estado del panel */}
          {leftPanel ? (
            <AiOutlineCaretLeft className="side-icon icon-white" />
          ) : (
            <AiOutlineCaretRight className="side-icon" />
          )}
        </button>
      )}

      {/* Panel izquierdo: solo visible si leftPanel está activo */}
      {leftPanel && (
        <div className="side-panel left-panel">
          <LeftPanel />
        </div>
      )}

      {/* Panel derecho: solo visible si rightPanel está activo */}
      {rightPanel && (
        <div className="side-panel right-panel">
          <RightPanel />
        </div>
      )}

      {/* Contenedor de imagen o texto central, con clase de animación dinámica */}
      <div
        className={`image-container ${
          showLearningZoneInfo ? "slide-left" : "slide-right"
        }`}
      >
        {/* Contenido por defecto: imagen, título y subtítulo */}
        {!showLearningZoneInfo && (
          <>
            <h3 className="title">CJE TECNOLOGY</h3>
            <img
              src={aboutImage}
              alt="about us"
              className="about-static-image"
            />
            <p className="subtitle">Más sobre Learning Zone</p>
          </>
        )}

        {/* Si se activa el modo info, se muestra el componente de texto y botón para volver */}
        {showLearningZoneInfo ? (
          <>
            <LearningZoneInfo />
            <button
              className="info-toggle-button rotated"
              onClick={toggleLearningZoneInfo}
            >
              <FaArrowRight className="icon" />
            </button>
          </>
        ) : (
          // Botón para activar el modo info (imagen → texto)
          <button
            className="info-toggle-button"
            onClick={toggleLearningZoneInfo}
          >
            <FaArrowRight className="icon" />
          </button>
        )}
      </div>

      {/* Botón derecho: solo aparece si no se está viendo el texto de Learning Zone */}
      {!showLearningZoneInfo && (
        <button
          className={`icon-button right ${rightPanel ? "above-panel" : ""}`}
          onClick={toggleRightPanel}
        >
          {/* Cambia el icono según el estado del panel */}
          {rightPanel ? (
            <AiOutlineCaretRight className="side-icon icon-white" />
          ) : (
            <AiOutlineCaretLeft className="side-icon" />
          )}
        </button>
      )}
    </div>
  );
};
