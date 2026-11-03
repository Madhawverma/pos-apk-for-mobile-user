import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[Database Fatal] MONGODB_URI is not defined in .env!');
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
