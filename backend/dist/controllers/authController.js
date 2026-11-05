"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.login = void 0;
const User_1 = require("../models/User");
const seed_1 = require("../seed");
const login = async (req, res) => {
    try {
        const { email, identifier, password } = req.body;
        const loginUser = (email || identifier || '').trim().toLowerCase();
        const loginPass = (password || '').trim();
        if (!loginUser || !loginPass) {
            res.status(400).json({
                success: false,
                error: 'Email and password are required',
            });
            return;
        }
        let user = await User_1.UserModel.findOne({ email: loginUser });
        // Fallback if database is fresh and matching env
        if (!user && loginUser === seed_1.DEFAULT_ADMIN_EMAIL.toLowerCase()) {
            user = await User_1.UserModel.create({
                email: seed_1.DEFAULT_ADMIN_EMAIL.toLowerCase(),
                password: seed_1.DEFAULT_ADMIN_PASS,
                name: seed_1.DEFAULT_ADMIN_NAME,
                role: 'admin',
            });
        }
        if (!user || user.password !== loginPass) {
            res.status(401).json({
                success: false,
                error: 'Invalid email or password. Please check your credentials.',
            });
            return;
        }
        res.json({
            success: true,
            data: {
                id: user.id || user._id,
                email: user.email,
                name: user.name || seed_1.DEFAULT_ADMIN_NAME,
                role: user.role || 'admin',
                mustChangePassword: !!user.mustChangePassword,
                token: 'token_' + Date.now(),
                sessionExpiresIn: 3600, // 1 hour session valid
                expiresAt: Date.now() + 3600 * 1000,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.login = login;
const changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        const userEmail = (email || '').trim().toLowerCase();
        const cleanOld = (oldPassword || '').trim();
        const cleanNew = (newPassword || '').trim();
        if (!userEmail || !cleanOld || !cleanNew) {
            res.status(400).json({
                success: false,
                error: 'Email, current password, and new password are required.',
            });
            return;
        }
        if (cleanNew.length < 4) {
            res.status(400).json({
                success: false,
                error: 'New password must be at least 4 characters long.',
            });
            return;
        }
        const user = await User_1.UserModel.findOne({ email: userEmail });
        if (!user || user.password !== cleanOld) {
            res.status(401).json({
                success: false,
                error: 'Current password is incorrect.',
            });
            return;
        }
        user.password = cleanNew;
        user.mustChangePassword = false;
        await user.save();
        res.json({
            success: true,
            message: 'Password successfully updated!',
            data: {
                email: user.email,
                name: user.name,
                mustChangePassword: false,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.changePassword = changePassword;
