import { io, Socket } from "socket.io-client";

const SOCKET_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1"
).replace(/\/api\/v1\/?$/, "");

let socket: Socket | null = null;

/**
 * Get (and lazily connect) the shared Socket.IO client, joining the given
 * user's room so the server can target notifications/messages at them.
 */
export const getSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_ORIGIN, { withCredentials: true });
  }

  if (socket.connected) {
    socket.emit("join", userId);
  } else {
    socket.once("connect", () => socket?.emit("join", userId));
  }

  return socket;
};
