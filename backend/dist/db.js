"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDB = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// Ensure dotenv finds .env even when running from root folder or subfolder
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
dotenv_1.default.config();
const connectMongoDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('[Database Fatal] MONGODB_URI is not defined in .env! Please set MONGODB_URI in backend/.env');
        process.exit(1);
    }
    try {
        await mongoose_1.default.connect(uri);
        console.log('[Database] MongoDB Atlas Connected Successfully! (Pure Cloud Storage)');
    }
    catch (err) {
        console.error('[Database Fatal] MongoDB Atlas Connection Failed:', err.message);
        process.exit(1);
    }
};
exports.connectMongoDB = connectMongoDB;
exports.default = mongoose_1.default;
