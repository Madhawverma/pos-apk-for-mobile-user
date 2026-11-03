import { usersDB } from './db';

// Fixed, never-changing admin credentials as requested
export const DEFAULT_ADMIN_EMAIL = 'ankit@ganeshoptical.com';
export const DEFAULT_ADMIN_PASS = 'Gnesh_optical';

export const seedDatabase = async () => {
  try {
    const existing = await usersDB.findOne({ email: DEFAULT_ADMIN_EMAIL.toLowerCase() });
    if (!existing) {
      await usersDB.insert({
        email: DEFAULT_ADMIN_EMAIL.toLowerCase(),
        password: DEFAULT_ADMIN_PASS,
        name: 'अंकित वर्मा (Ankit Verma)',
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      console.log(`[Seed] Seeded default never-changing admin account: ${DEFAULT_ADMIN_EMAIL}`);
    } else {
      // Ensure password and details always stay synchronized with requested credentials
      await usersDB.update(
        { email: DEFAULT_ADMIN_EMAIL.toLowerCase() },
        {
          $set: {
            password: DEFAULT_ADMIN_PASS,
            name: 'अंकित वर्मा (Ankit Verma)',
            role: 'admin',
          },
        }
      );
      console.log(`[Seed] Verified never-changing credentials for ${DEFAULT_ADMIN_EMAIL}`);
    }
  } catch (error) {
    console.error('[Seed] Error seeding users:', error);
  }
};
