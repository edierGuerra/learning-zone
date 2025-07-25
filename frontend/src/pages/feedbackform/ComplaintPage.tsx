import { useState } from "react";
import ComplaintForm from "../components/feedbackform/ComplaintForm";
import SuccessMessage from "../components/feedbackform/SuccessMessage";
import "../components/feedbackform/styles/Complain.css";
import { useNavigationHandler } from "../../hooks/useNavigationHandler";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const ComplaintPage = () => {
  const [sent, setSent] = useState(false);
  const handleBtnNavigate = useNavigationHandler()


  return (
    <div className="complaint-page">
      <button className="btn-back-complain" onClick={()=>handleBtnNavigate('/back')}>{<IoArrowBackCircleSharp/>}</button>

      <header className="complaint-header">
        <h1> Quejas y Observaciones</h1>
        <p>
          Si tienes algún comentario, queja o sugerencia sobre la plataforma o los cursos, 
          por favor llena el siguiente formulario.
        </p>
      </header>

      {sent ? (
        <SuccessMessage onReset={() => setSent(false)} />
      ) : (
        <ComplaintForm onSuccess={() => setSent(true)} />
      )}
    </div>
  );
};

export default ComplaintPage;
