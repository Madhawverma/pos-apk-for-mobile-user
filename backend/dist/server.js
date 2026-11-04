"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = __importDefault(require("./routes/api"));
const seed_1 = require("./seed");
const db_1 = require("./db");
const auth_1 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5000;
const STORE_NAME = process.env.SHOP_NAME || 'Shree Ganesh Optical';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Protect all /api endpoints with secure API Key Authentication (except health check)
app.use('/api', auth_1.apiKeyAuth);
// API Routes
app.use('/api', api_1.default);
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
        }
        catch (_) { }
    }, 15000);
    // 2. Continuous 24x7 recurring loop
    setInterval(async () => {
        try {
            const pingUrl = `${targetUrl}/api/health`;
            const res = await fetch(pingUrl);
            console.log(`[Keep-Alive Engine Active] Pinged ${pingUrl} - Status: ${res.status} at ${new Date().toLocaleTimeString('en-IN')}`);
        }
        catch (e) {
            // Local fallback ping if external DNS takes time
            try {
                await fetch(`http://127.0.0.1:${PORT}/api/health`);
            }
            catch (_) { }
            console.log(`[Keep-Alive Ping]: ${e?.message || 'Handled'}`);
        }
    }, PING_INTERVAL_MS);
    console.log(`[Keep-Alive Engine Started] 24/7 background heartbeat running targeting: ${targetUrl}`);
};
const startServer = async () => {
    await (0, db_1.connectMongoDB)();
    await (0, seed_1.seedDatabase)();
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`[${STORE_NAME} Backend] running at: http://localhost:${PORT}`);
        console.log(`[Network IP] http://10.52.100.127:${PORT}/api`);
        startSelfKeepAlive();
    });
};
startServer();
