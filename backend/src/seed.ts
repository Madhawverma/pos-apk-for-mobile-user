import { UserModel } from './models/User';
import dotenv from 'dotenv';

dotenv.config();

export const DEFAULT_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'ankit@ganeshoptical.com').toLowerCase().trim();
export const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || '11111111';
export const DEFAULT_ADMIN_NAME = process.env.ADMIN_NAME || 'अंकित वर्मा (Ankit Verma)';

export const seedDatabase = async () => {
  try {
    const email = DEFAULT_ADMIN_EMAIL;
    const existing = await UserModel.findOne({ email });
    if (!existing) {
      await UserModel.create({
        email,
        password: DEFAULT_ADMIN_PASS,
        name: DEFAULT_ADMIN_NAME,
        role: 'admin',
        mustChangePassword: true,
      });
      console.log(`[MongoDB Atlas] Created initial admin account ${email} with default password`);
    } else {
      // Keep existing user or sync if password was reset
      console.log(`[MongoDB Atlas] Verified admin account ${email}`);
    }
  } catch (error) {
    console.error('[MongoDB Atlas] Error seeding users:', error);
  }
};
