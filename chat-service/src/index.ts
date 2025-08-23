import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerSocketHandlers } from './socket';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:80",
      "http://frontend",
      "https://learning-zone-app.ondigitalocean.app",
      process.env.FRONTEND_URL || "https://localhost:3000",
    ],
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// Health check endpoint para Docker
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "chat-service",
    timestamp: new Date().toISOString(),
  });
});

registerSocketHandlers(io);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket server running at http://localhost:${PORT}`);
});
