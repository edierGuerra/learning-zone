import Lottie from "lottie-react";
import unauthorizedAnimation from "../error/styles/Animations/Session Expired.json";
import "./styles/UnauthorizedAccess.css";
import { useNavigationHandler } from "../../hooks/useNavigationHandler";

const UnauthorizedAccess = () => {
  const handleBtnNavigate = useNavigationHandler();

  return (
    <div className="error-page unauthorized-access-page">
      <div className="error-animation unauthorized-access-animation">
        <Lottie animationData={unauthorizedAnimation} loop={true} />
      </div>
      <h1 className="unauthorized-access-title">🚫 Error 401 Acceso no autorizado🚫</h1>
      <p className="unauthorized-access-text">Parece que no has iniciado sesión o tu sesión ha expirado. Por favor, inicia sesión para acceder a esta sección de la plataforma.</p>
        <button className="error-button unauthorized-access-button" onClick={() => handleBtnNavigate("/back")}>
        Volver al inicio
        </button>
    </div>
  );
};

export default UnauthorizedAccess;
