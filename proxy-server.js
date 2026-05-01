const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PROXY_PORT || 5000;

// CHANGE: Enhanced CORS configuration for Ngrok
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// CHANGE: Add security headers for Ngrok compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// CHANGE: Enhanced WebSocket proxy with better error handling
const wsProxy = createProxyMiddleware('/socket.io', {
  target: 'http://localhost:4000',
  changeOrigin: true,
  ws: true,
  logLevel: 'debug',
  // CHANGE: Add WebSocket upgrade handling for Ngrok
  onProxyReqWs: (proxyReq, req, socket) => {
    console.log('WebSocket proxying:', req.url);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
  }
});

// CHANGE: Enhanced API proxy with better error handling
const apiProxy = createProxyMiddleware('/api', {
  target: 'http://localhost:4000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',
  },
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error('API proxy error:', err);
    res.status(500).json({ error: 'Proxy error' });
  }
});

// CHANGE: Enhanced React dev proxy with Ngrok compatibility
const reactDevProxy = createProxyMiddleware('/', {
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true,
  logLevel: 'debug',
  filter: (pathname, req) => {
    return !pathname.startsWith('/api') && !pathname.startsWith('/socket.io');
  },
  onError: (err, req, res) => {
    console.error('React dev proxy error:', err);
  }
});

// Apply proxies in order
app.use(wsProxy);
app.use('/api', apiProxy);
app.use(reactDevProxy);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Development proxy server running on port ${PORT}`);
  console.log(`📱 Frontend (via React dev server): http://localhost:${PORT}`);
  console.log(`🔌 Backend API: http://localhost:${PORT}/api`);
  console.log(`🌐 WebSocket: http://localhost:${PORT}/socket.io`);
  console.log(`🌍 Ngrok URL: Replace localhost:${PORT} with your Ngrok URL`);
  console.log(`⚠️  Make sure React dev server is running on http://localhost:3000`);
});