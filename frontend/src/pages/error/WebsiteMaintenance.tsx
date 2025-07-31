import Lottie from "lottie-react";
import Animation from "../error/styles/Animations/Under Maintenance.json";
import "./styles/ServerError.css";
import { useNavigationHandler } from "../../hooks/useNavigationHandler";

const WebsiteMaintenance = () => {
  const handleBtnNavigate = useNavigationHandler();

  return (
    <div className="error-page maintenance-page">
      <div className="error-animation maintenance-animation">
        <Lottie animationData={Animation} loop={true} />
      </div>
      <h1 className="maintenance-title">Error 503 Servicio no disponible</h1>
      <p className="maintenance-text">El servidor está temporalmente fuera de servicio.
        Estamos trabajando para solucionar el problema lo antes posible.
        Por favor, intenta de nuevo en unos minutos.</p>
        <button className="error-button maintenance-button" onClick={() => handleBtnNavigate("/back")}>
        Volver al inicio
        </button>
    </div>
  );
};

export default WebsiteMaintenance;
