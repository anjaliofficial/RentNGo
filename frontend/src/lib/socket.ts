import { io, Socket } from "socket.io-client";

const getSocketOrigin = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

  // Absolute URL configured (e.g. "http://host:5000/api/v1") — strip the API suffix.
  if (/^https?:\/\//.test(apiUrl)) {
    return apiUrl.replace(/\/api\/v1\/?$/, "");
  }

  // Relative URL (e.g. "/api/v1", proxied through Next.js rewrites) — the
  // backend always runs on port 5000 on the same host serving this page.
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }

  return "http://localhost:5000";
};

const SOCKET_ORIGIN = getSocketOrigin();

// Stashed on globalThis (not a plain module-level `let`) so the connection
// survives Next.js Fast Refresh in dev — otherwise each hot reload of this
// module can spin up a second live socket, and both end up delivering the
// same "message:new"/"notification" event, producing visible duplicates.
declare global {
  // eslint-disable-next-line no-var
  var __rentngoSocket: Socket | undefined;
}

/**
 * Get (and lazily connect) the shared Socket.IO client, joining the given
 * user's room so the server can target notifications/messages at them.
 */
export const getSocket = (userId: string): Socket => {
  if (!globalThis.__rentngoSocket) {
    globalThis.__rentngoSocket = io(SOCKET_ORIGIN, { withCredentials: true });
  }

  const socket = globalThis.__rentngoSocket;

  if (socket.connected) {
    socket.emit("join", userId);
  } else {
    socket.once("connect", () => socket.emit("join", userId));
  }

  return socket;
};
