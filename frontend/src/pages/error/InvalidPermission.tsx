import Lottie from "lottie-react";
import unauthorizedAnimation from "../error/styles/Animations/search for employee.json"; 
import "../error/styles/InvalidPermission.css";
import { useNavigationHandler } from "../../hooks/useNavigationHandler";

const Error401 = () => {
  const handleBtnNavigate = useNavigationHandler();

  return (
    <div className="error-page">
      <div className="error-animation">
        <Lottie animationData={unauthorizedAnimation} loop={true} />
      </div>
      <h1>🚫 Error 403 Acceso denegado🚫</h1>
      <p>Tienes sesión iniciada, pero no tienes permisos para ver esta sección</p>
        <button className="error-button" onClick={() => handleBtnNavigate("/back")}>
        Volver al inicio
        </button>
    </div>
  );
};

export default Error401;
