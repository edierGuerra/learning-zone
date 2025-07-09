import axios from '../../../api/axiosInstance';
import type { TNotification } from "../types/Notifications";

type TDeleteNotificationsAPIResponse = {
  status: number;
  message: string;
};

const VITE_NOTIFICATIONS_ENDPOINT = import.meta.env.VITE_NOTIFICATIONS_ENDPOINT;

export default async function DeleteNotificationsAPI(
  idNotificacion?: TNotification['id']
): Promise<TDeleteNotificationsAPIResponse> {
  try {
    const url = idNotificacion
      ? `${VITE_NOTIFICATIONS_ENDPOINT}?id_notification=${idNotificacion}`
      : VITE_NOTIFICATIONS_ENDPOINT;

    const response = await axios.delete(url);

    // Aquí sí se puede acceder al contenido porque el backend devuelve status 200 con JSON
    return {
      status: response.status,
      message: response.data?.message || "Notificación eliminada",
    };

  } catch (error) {
    console.error("Error en DeleteNotificationsAPI:", error);
    throw error;
  }
}
