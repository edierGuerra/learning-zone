import Lottie from "lottie-react";
import unauthorizedAnimation from "../error/styles/Animations/search for employee.json";
import "./styles/InvalidPermission.css";
import { useNavigationHandler } from "../../hooks/useNavigationHandler";

const InvalidPermission = () => {
  const handleBtnNavigate = useNavigationHandler();

  return (
    <div className="error-page invalid-permission-page">
      <div className="error-animation invalid-permission-animation">
        <Lottie animationData={unauthorizedAnimation} loop={true} />
      </div>
      <h1 className="invalid-permission-title">🚫 Error 403 Acceso denegado🚫</h1>
      <p className="invalid-permission-text">Tienes sesión iniciada, pero no tienes permisos para ver esta sección</p>
        <button className="error-button invalid-permission-button" onClick={() => handleBtnNavigate("/back")}>
        Volver al inicio
        </button>
    </div>
  );
};

export default InvalidPermission;
