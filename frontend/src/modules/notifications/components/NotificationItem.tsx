// ✅ Importo el ícono de eliminar
import { MdDelete } from "react-icons/md";

// ✅ Hook de estado para manejar si se muestra todo el mensaje o solo un recorte
import { useState } from "react";

// ✅ Hook que maneja la lógica de eliminar notificaciones
import useNotifications from "../hooks/useNotifications";

// ✅ Estilos propios para este componente
import "../styles/NotificationItem.css";

// ✅ Tipado de la notificación que recibo por props
import type { TNotification } from "../types/Notifications";

// ✅ Recibo una notificación individual para mostrar
type TNotificationItemProps = {
  notification: TNotification;
};

// ✅ Componente que muestra una tarjeta de notificación con su título, fecha, mensaje y acciones
export default function NotificationItem({ notification }: TNotificationItemProps) {
  // 🔧 Traigo la función para eliminar una sola notificación
  const { deleteItemNotification } = useNotifications();

  // 🔄 Estado para mostrar todo el texto o solo una parte
  const [showFull, setShowFull] = useState(false);

  // 🔢 Límite para cortar el mensaje cuando es largo
  const maxLength = 120;

  // 🧠 Verifico si el mensaje supera el límite, así muestro el botón "ver más"
  const isLong = notification.message.length > maxLength;

  // ✅ Alternar entre mostrar todo o solo una parte del mensaje
  const toggleShow = () => setShowFull((prev) => !prev);

  return (
    <div className="container-notification">
      {/* 🧾 Cabecera con el título y la fecha */}
      <div className="header-notification">
        <h2 className="title-notification">{notification.title}</h2>
        <span className="date-notification">{notification.date}</span>
      </div>

      {/* 📄 Cuerpo con el mensaje y acciones */}
      <div className="body-notification">
        {/* 📌 Mostrar el mensaje completo o cortado según el estado */}
        <p className="message-notification">
          {showFull || !isLong
            ? notification.message // Si está expandido o no es largo, mostrar todo
            : 
            notification.message.slice(0, maxLength) + "..." }
            {isLong && (
          <button
            onClick={toggleShow}
            className="btn-toggle-message"
          >
            {showFull ? "Ver menos" : "Ver más"} {/* Cambia el texto del botón */}
          </button>
          )}
        </p>

        {/* 👁‍🗨 Mostrar botón "Ver más / Ver menos" solo si el mensaje es largo */}
        

        {/* 🗑 Botón para eliminar una sola notificación */}
        <button
          className="btn-delete-notification"
          onClick={() => deleteItemNotification(notification.id)}
        >
          <MdDelete />
        </button>
      </div>
    </div>
  );
}
