import { Server, Socket } from "socket.io";

let io: Server;

/**
 * Initialize Socket.IO
 */
export const initializeSocket = (
  socketServer: Server
) => {
  io = socketServer;

  io.on(
    "connection",
    (socket: Socket) => {
      console.log(
        `✅ Socket Connected: ${socket.id}`
      );

      /**
       * Join User Room
       */
      socket.on(
        "join",
        (userId: string) => {
          socket.join(userId);

          console.log(
            `User ${userId} joined room`
          );
        }
      );

      /**
       * Disconnect
       */
      socket.on(
        "disconnect",
        () => {
          console.log(
            `❌ Socket Disconnected: ${socket.id}`
          );
        }
      );
    }
  );
};

/**
 * Get Socket.IO Instance
 */
export const getIO = (): Server => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized."
    );
  }

  return io;
};