/* Servicio usado para obtener las notificaciones */

import axios from '../../../api/axiosInstance';
import type { TNotificationsStudent } from "../types/Notifications";

const VITE_NOTIFICATIONS_ENDPOINT = import.meta.env.VITE_NOTIFICATIONS_ENDPOINT;

export default async function GetNotificationsAPI(): Promise<TNotificationsStudent> {
  try {
    const response = await axios.get(VITE_NOTIFICATIONS_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
