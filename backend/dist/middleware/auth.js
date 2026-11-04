"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyAuth = void 0;
// Secret key known only to your Mobile App and Backend
const API_SECRET_KEY = process.env.API_SECRET_KEY || 'shree-ganesh-optical-secret-key-2026';
const apiKeyAuth = (req, res, next) => {
    // Allow health check without key so keep-alive and uptime monitors work
    if (req.path === '/health' || req.path === '/' || req.method === 'OPTIONS') {
        next();
        return;
    }
    const clientKey = req.headers['x-api-key'] || req.headers['authorization'];
    if (!clientKey || clientKey !== API_SECRET_KEY) {
        res.status(401).json({
            success: false,
            error: 'Unauthorized: Invalid or missing API Security Key',
        });
        return;
    }
    next();
};
exports.apiKeyAuth = apiKeyAuth;
