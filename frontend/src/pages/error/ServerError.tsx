import Lottie from "lottie-react";
import Animation from "../error/styles/Animations/Error.json"; 
import "./styles/ServerError.css";
import { useNavigationHandler } from "../../hooks/useNavigationHandler";

const ServerError = () => {
  const handleBtnNavigate = useNavigationHandler();

  return (
    <div className="error-page server-error-page">
      <div className="error-animation server-error-animation">
        <Lottie animationData={Animation} loop={true} />
      </div>
      <h1 className="server-error-title">Error servidor algo salió mal...</h1>
      <p className="server-error-text">¡Error 500! Parece que hubo un error inesperado en nuestro sistema.  
        Estamos trabajando para solucionarlo lo antes posible.  
        Porfavor, intenta de nuevo más tarde.</p>
        <button className="error-button server-error-button" onClick={() => handleBtnNavigate("/back")}> 
        Volver al inicio
        </button>
    </div>
  );
};

export default ServerError;
