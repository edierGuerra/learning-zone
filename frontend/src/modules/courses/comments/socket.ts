import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const chatUrl = import.meta.env.VITE_CHAT_URL || "https://localhost:3001";
    socket = io(chatUrl, {
      autoConnect: false,
      reconnectionAttempts: 2, // limita intentos
      reconnectionDelay: 3000,
    });

    // Log de conexión y errores
    socket.on("connect", () => console.log("✅ Socket conectado"));
    socket.on("connect_error", (error) =>
      console.error("❌ Error de conexión:", error)
    );
  }
  return socket;
};

export const connectSocket = (): Socket => {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = (): void => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};
