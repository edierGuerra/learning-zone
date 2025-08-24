import { useState } from "react";
import axios from "../../../api/axiosInstance"; // Usar axios en lugar de fetch
import "../feedbackform/styles/Complain.css";
import { useUser } from "../../../modules/auth/Hooks/useAuth";

interface UserData {
  name: string,
  email: string,
  asunto:string,
  comment: string
}
interface ComplaintFormProps {
  onSuccess: () => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onSuccess }) => {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>({
    asunto: "",
    comment: "",
    email: user!.email,
    name: user!.name,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("dato listos para enviar", userData);

    try {
      const response = await axios.post("/suggestions/send", { userData });
      
      onSuccess(); // avisamos al padre que fue exitoso
    } catch (error) {
      console.error("Error al enviar queja:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="complaint-form">
      <h2>Completar con tus datos</h2>

      <label htmlFor="asunto">Asunto</label>
      <input
        type="text"
        id="asunto"
        value={userData?.asunto || ""}
        onChange={(e) =>
          setUserData((prev) => ({
            ...prev!,
            asunto: e.target.value,
          }))
        }
      />

      {/*       <label htmlFor="correo">Correo electrónico:</label>
      <input
        type="email"
        id="correo"
        value={userData?.email || ""}
        readOnly
        placeholder="Cargando correo..."
      /> */}

      <label htmlFor="comment ">Comentario:</label>
      <textarea
        id="comment"
        rows={5}
        value={userData?.comment}
        onChange={(e) =>
          setUserData((prev) => ({
            ...prev!,
            comment: e.target.value,
          }))
        }
        placeholder="Escribe tu queja, sugerencia u observación"
      />

      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
};

export default ComplaintForm;
