import { useState } from "react";
import aboutImage from "../../assets/cjeTect/Team.jpg";
import "../about/styles/TeamInfo.css";
import RightPanel from "../components/teamInfo/RightPanel";
import LeftPanel from "../components/teamInfo/LeftPanel";
import LearningZoneInfo from "../components/teamInfo/LearningZoneInfo";
import { AiOutlineCaretRight, AiOutlineCaretLeft } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigationHandler } from "../../hooks/useNavigationHandler";

export const AboutUs = () => {
  const handleBtnNavigate = useNavigationHandler();

  const [leftPanel, setLeftPanel] = useState(false);
  const [rightPanel, setRightPanel] = useState(false);
  const [showLearningZoneInfo, setShowLearningZoneInfo] = useState(false);

  const toggleLeftPanel = () => {
    setLeftPanel(!leftPanel);
    setRightPanel(false);
  };

  const toggleRightPanel = () => {
    setRightPanel(!rightPanel);
    setLeftPanel(false);
  };

  const toggleLearningZoneInfo = () => {
    setShowLearningZoneInfo(!showLearningZoneInfo);
    setLeftPanel(false);
    setRightPanel(false);
  };

  return (
    <div className={`about-us-container ${leftPanel ? "left-panel-open" : ""}`}>
      {/* Botón de retroceso */}
      <button className="btn-back-team" onClick={() => handleBtnNavigate("/back")}>
        <IoArrowBackCircleSharp />
      </button>

      {/* Botones de navegación: solo si ambos paneles están cerrados y no se muestra LearningZoneInfo */}
      {!showLearningZoneInfo && !leftPanel && !rightPanel && (
        <div className="navigation-buttons">
          {/* Flecha derecha para el panel izquierdo */}
          <button
            className="icon-button"
            onClick={toggleLeftPanel}
            title="Abrir panel izquierdo"
          >
            <AiOutlineCaretRight className="side-icon" />
          </button>

          {/* Flecha izquierda para el panel derecho */}
          <button
            className="icon-button"
            onClick={toggleRightPanel}
            title="Abrir panel derecho"
          >
            <AiOutlineCaretLeft className="side-icon" />
          </button>
        </div>
      )}

      {/* Panel izquierdo */}
      {leftPanel && (
        <div className="side-panel left-panel">
          <LeftPanel onClose={() => setLeftPanel(false)} />
        </div>
      )}

      {/* Panel derecho */}
      {rightPanel && (
        <div className="side-panel right-panel">
          <RightPanel onClose={() => setRightPanel(false)} />
        </div>
      )}

      {/* Contenido central */}
      <div className={`image-container ${showLearningZoneInfo ? "slide-left" : "slide-right"}`}>
        {!showLearningZoneInfo ? (
          <>
            <h3 className="title">CJE TECHNOLOGY</h3>
            <img src={aboutImage} alt="about us" className="about-static-image" />
            <p className="subtitle">Más sobre Learning Zone</p>
            <button className="info-toggle-button" onClick={toggleLearningZoneInfo}>
              <FaArrowRight className="icon" />
            </button>
          </>
        ) : (
          <>
            <LearningZoneInfo />
            <button className="info-toggle-button rotated" onClick={toggleLearningZoneInfo}>
              <FaArrowRight className="icon" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
