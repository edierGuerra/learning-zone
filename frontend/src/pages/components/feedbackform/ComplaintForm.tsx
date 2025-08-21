import { useState, useEffect } from "react";
import "../feedbackform/styles/Complain.css";

interface UserData {
  name: string;
  email: string;
}

interface ComplaintFormProps {
  onSuccess: () => void; 
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onSuccess }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/user/me");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error al traer datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/complaints/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData?.name,
          email: userData?.email,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar la queja");
      }

      setMessage(""); 
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

      <label htmlFor="nombre">Nombre completo:</label>
      <input
        type="text"
        id="nombre"
        value={userData?.name || ""}
        readOnly
        placeholder="Cargando nombre..."
      />

      <label htmlFor="correo">Correo electrónico:</label>
      <input
        type="email"
        id="correo"
        value={userData?.email || ""}
        readOnly
        placeholder="Cargando correo..."
      />

      <label htmlFor="comentario">Comentario:</label>
      <textarea
        id="comentario"
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu queja, sugerencia u observación"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
};

export default ComplaintForm;
