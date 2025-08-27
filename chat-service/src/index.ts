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
      "http://cjetechnology.org",
      "http://cjetechnology.org/chat",
      "http://localhost:80",
      "http://frontend",
      "https://cjetechnology.org/backend",
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
  console.log(`🚀 Socket server running at http://cjetechnology.org/chat:${PORT}`);
});
