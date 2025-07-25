import Lottie from "lottie-react";
import unauthorizedAnimation from "../error/styles/Animations/Session Expired.json"; 
import "../error/styles/UnauthorizedAccess.css";
import { useNavigationHandler } from "../../hooks/useNavigationHandler";

const Error401 = () => {
  const handleBtnNavigate = useNavigationHandler();

  return (
    <div className="error-page">
      <div className="error-animation">
        <Lottie animationData={unauthorizedAnimation} loop={true} />
      </div>
      <h1>🚫 Error 401 Acceso no autorizado🚫</h1>
      <p>Parece que no has iniciado sesión o tu sesión ha expirado. Por favor, inicia sesión para acceder a esta sección de la plataforma.</p>
        <button className="error-button" onClick={() => handleBtnNavigate("/back")}>
        Volver al inicio
        </button>
    </div>
  );
};

export default Error401;
