import Lottie from "lottie-react";
import Animation from "../error/styles/Animations/Error.json"; 
import "../error/styles/ServerError.css";
import { useNavigationHandler } from "../../hooks/useNavigationHandler";

const Error401 = () => {
  const handleBtnNavigate = useNavigationHandler();

  return (
    <div className="error-page">
      <div className="error-animation">
        <Lottie animationData={Animation} loop={true} />
      </div>
      <h1>Error servidor algo salió mal...</h1>
      <p>Parece que hubo un error inesperado en nuestro sistema.  
        Estamos trabajando para solucionarlo lo antes posible.  
        Porfavor, intenta de nuevo más tarde.</p>
        <button className="error-button" onClick={() => handleBtnNavigate("/back")}>
        Volver al inicio
        </button>
    </div>
  );
};

export default Error401;
