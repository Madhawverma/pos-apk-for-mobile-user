import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Ensure dotenv finds .env even when running from root folder or subfolder
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

export const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[Database Fatal] MONGODB_URI is not defined in .env! Please set MONGODB_URI in backend/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('[Database] MongoDB Atlas Connected Successfully! (Pure Cloud Storage)');
  } catch (err: any) {
    console.error('[Database Fatal] MongoDB Atlas Connection Failed:', err.message);
    process.exit(1);
  }
};

export default mongoose;
