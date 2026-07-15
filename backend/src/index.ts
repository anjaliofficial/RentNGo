import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import app from "./app";
import { connectDB } from "./database";

import { initializeSocket } from "./socket/socket";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Create HTTP Server
    const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST"],
  },
});
    initializeSocket(io);

    server.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );
    process.exit(1);
  }
};

startServer();