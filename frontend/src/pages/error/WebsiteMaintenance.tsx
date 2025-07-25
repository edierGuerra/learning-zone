import Lottie from "lottie-react";
import Animation from "../error/styles/Animations/Under Maintenance.json"; 
import "../components/styles/ServerError.css";
import { useNavigationHandler } from "../../hooks/useNavigationHandler";

const Error401 = () => {
  const handleBtnNavigate = useNavigationHandler();

  return (
    <div className="error-page">
      <div className="error-animation">
        <Lottie animationData={Animation} loop={true} />
      </div>
      <h1>Error 503 Servicio no disponible</h1>
      <p>El servidor está temporalmente fuera de servicio. 
        Estamos trabajando para solucionar el problema lo antes posible. 
        Por favor, intenta de nuevo en unos minutos.</p>
        <button className="error-button" onClick={() => handleBtnNavigate("/back")}>
        Volver al inicio
        </button>
    </div>
  );
};

export default Error401;
