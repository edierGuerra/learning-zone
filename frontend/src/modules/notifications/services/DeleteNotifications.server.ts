import axios from '../../../api/axiosInstance';
import type { TNotification } from "../types/Notifications";

type TDeleteNotificationsAPIResponse = {
  status: number;
  message: string;
};

// Usar endpoint específico para eliminar notificaciones
const DELETE_NOTIFICATIONS_ENDPOINT = import.meta.env.VITE_DELETE_NOTIFICATIONS_ENDPOINT || '/api/v1/student/notifications';

export default async function DeleteNotificationsAPI(
  idNotificacion?: TNotification['id']
): Promise<TDeleteNotificationsAPIResponse> {
  try {
    console.log('🔧 Deleting notification ID:', idNotificacion);
    
    // Configurar parámetros de query si se especifica una notificación específica
    const config = idNotificacion 
      ? { params: { id_notification: idNotificacion } }
      : {};

    console.log('🔧 Delete config:', config);

    const response = await axios.delete(DELETE_NOTIFICATIONS_ENDPOINT, config);

    // Aquí sí se puede acceder al contenido porque el backend devuelve status 200 con JSON
    return {
      status: response.status,
      message: response.data?.message || "Notificación eliminada",
    };

  } catch (error) {
    console.error("❌ Error en DeleteNotificationsAPI:", error);
    throw error;
  }
}
