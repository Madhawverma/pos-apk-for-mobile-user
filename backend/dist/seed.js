"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = exports.DEFAULT_ADMIN_NAME = exports.DEFAULT_ADMIN_PASS = exports.DEFAULT_ADMIN_EMAIL = void 0;
const User_1 = require("./models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DEFAULT_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'ankit@ganeshoptical.com').toLowerCase().trim();
exports.DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || '11111111';
exports.DEFAULT_ADMIN_NAME = process.env.ADMIN_NAME || 'अंकित वर्मा (Ankit Verma)';
const seedDatabase = async () => {
    try {
        const email = exports.DEFAULT_ADMIN_EMAIL;
        const existing = await User_1.UserModel.findOne({ email });
        if (!existing) {
            await User_1.UserModel.create({
                email,
                password: exports.DEFAULT_ADMIN_PASS,
                name: exports.DEFAULT_ADMIN_NAME,
                role: 'admin',
                mustChangePassword: true,
            });
            console.log(`[MongoDB Atlas] Created initial admin account ${email} with default password`);
        }
        else {
            // Keep existing user or sync if password was reset
            console.log(`[MongoDB Atlas] Verified admin account ${email}`);
        }
    }
    catch (error) {
        console.error('[MongoDB Atlas] Error seeding users:', error);
    }
};
exports.seedDatabase = seedDatabase;
