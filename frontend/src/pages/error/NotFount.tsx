import Lottie from "lottie-react";
import Animation from "../error/styles/Animations/404 blue.json";
import "../error/styles/NotFound.css";
import { useNavigationHandler } from "../../hooks/useNavigationHandler";

const Error404 = () => {
      const handleBtnNavigate = useNavigationHandler();
  return (
    <div className="error404-container fade-in">
      <div className="animation-wrapper floating">
        <Lottie animationData={Animation} loop={true} />
      </div>
      <h1>¡Ups! Página no encontrada </h1>
      <p>¡Error 404! Esta página decidió que hoy era buen día para hacerse invisible. ¡Y lo logró!</p>
            <button className="btn-back-team" onClick={() => handleBtnNavigate("/back")}>
              Volver al inicio
            </button>
    </div>
  );
};
export default Error404;
