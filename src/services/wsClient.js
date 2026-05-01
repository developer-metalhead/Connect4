import { io } from "socket.io-client";

// CHANGE: Dynamic URL configuration for Ngrok compatibility
const getSocketURL = () => {
  // Check if we're running in development with Ngrok
  const hostname = window.location.hostname;
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
  
  // If hostname contains ngrok, use the current origin
  if (hostname.includes('ngrok') || hostname.includes('ngrok-free.app')) {
    return `${protocol}//${hostname}`;
  }
  
  // Use environment variable or fallback to localhost
  return process.env.REACT_APP_WS_URL || "http://localhost:5000";
};

const URL = getSocketURL();

export const socket = io(URL, {
  autoConnect: false,
  // CHANGE: Enhanced transport configuration for Ngrok
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 500,
  reconnectionDelayMax: 4000,
  // CHANGE: Add timeout and upgrade settings for Ngrok
  timeout: 20000,
  upgrade: true,
  // CHANGE: Add extra headers for Ngrok compatibility
  extraHeaders: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
  }
});

// CHANGE: Add connection logging for debugging
socket.on('connect', () => {
  console.log('🔌 Connected to server:', URL);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected from server:', reason);
});

socket.on('connect_error', (error) => {
  console.error('🚫 Connection error:', error);
});

export default socket;