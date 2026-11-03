import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { seedDatabase } from './seed';
import { connectMongoDB } from './db';
import { apiKeyAuth } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const STORE_NAME = process.env.SHOP_NAME || 'Shree Ganesh Optical';

app.use(cors());
app.use(express.json());

// Protect all /api endpoints with secure API Key Authentication (except health check)
app.use('/api', apiKeyAuth);

// API Routes
app.use('/api', apiRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    message: `Welcome to ${STORE_NAME} POS API Server`,
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Built-in Bulletproof Keep-Alive Engine (Prevents Render from ever sleeping)
const startSelfKeepAlive = () => {
  // Render automatically assigns RENDER_EXTERNAL_URL or RENDER_SERVICE_NAME
  const serviceName = process.env.RENDER_SERVICE_NAME;
  const autoUrl = serviceName ? `https://${serviceName}.onrender.com` : undefined;
  const targetUrl = process.env.RENDER_EXTERNAL_URL || autoUrl || `http://localhost:${PORT}`;

  // Ping every 10 minutes (600,000 ms) so Render's 15-minute sleep threshold is never reached
  const PING_INTERVAL_MS = 10 * 60 * 1000;

  // 1. Initial warm-up ping after 15 seconds
  setTimeout(async () => {
    try {
      const res = await fetch(`${targetUrl}/api/health`);
      console.log(`[Keep-Alive Warmup] First ping successful: ${res.status}`);
    } catch (_) {}
  }, 15000);

  // 2. Continuous 24x7 recurring loop
  setInterval(async () => {
    try {
      const pingUrl = `${targetUrl}/api/health`;
      const res = await fetch(pingUrl);
      console.log(`[Keep-Alive Engine Active] Pinged ${pingUrl} - Status: ${res.status} at ${new Date().toLocaleTimeString('en-IN')}`);
    } catch (e: any) {
      // Local fallback ping if external DNS takes time
      try {
        await fetch(`http://127.0.0.1:${PORT}/api/health`);
      } catch (_) {}
      console.log(`[Keep-Alive Ping]: ${e?.message || 'Handled'}`);
    }
  }, PING_INTERVAL_MS);

  console.log(`[Keep-Alive Engine Started] 24/7 background heartbeat running targeting: ${targetUrl}`);
};

const startServer = async () => {
  await connectMongoDB();
  await seedDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[${STORE_NAME} Backend] running at: http://localhost:${PORT}`);
    console.log(`[Network IP] http://10.52.100.127:${PORT}/api`);
    startSelfKeepAlive();
  });
};

startServer();
