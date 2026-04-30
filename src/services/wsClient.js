import { io } from "socket.io-client";

const URL = process.env.REACT_APP_WS_URL || "http://localhost:4000";

export const socket = io(URL, {
  autoConnect: false,
  // Allow fallback to polling if pure WebSocket is blocked by proxies/CDNs
  transports: ["websocket", "polling"],
  reconnection: true,

  reconnectionAttempts: 10,
  reconnectionDelay: 500,
  reconnectionDelayMax: 4000,
});

export default socket;
