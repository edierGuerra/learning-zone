import Lottie from "lottie-react";
import Animation from "../error/styles/Animations/404 blue.json";
import "./styles/NotFound.css";
import { useNavigationHandler } from "../../hooks/useNavigationHandler";

const NotFound = () => {
      const handleBtnNavigate = useNavigationHandler();
  return (
    <div className="error404-container fade-in notfound-page">
      <div className="animation-wrapper floating notfound-animation">
        <Lottie animationData={Animation} loop={true} />
      </div>
      <h1 className="notfound-title">¡Ups! Página no encontrada </h1>
      <p className="notfound-text">¡Error 404! Esta página decidió que hoy era buen día para hacerse invisible. ¡Y lo logró!</p>
            <button className="btn-back-team notfound-button" onClick={() => handleBtnNavigate("/back")}> 
              Volver al inicio
            </button>
    </div>
  );
};
export default NotFound;
