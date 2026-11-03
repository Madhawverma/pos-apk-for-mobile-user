import path from 'path';
import Datastore from 'nedb-promises';
import mongoose from 'mongoose';

const dataDir = path.join(__dirname, '..', 'data_storage');

export const usersDB = Datastore.create({
  filename: path.join(dataDir, 'users.db'),
  autoload: true,
});

export const productsDB = Datastore.create({
  filename: path.join(dataDir, 'products.db'),
  autoload: true,
});

export const customersDB = Datastore.create({
  filename: path.join(dataDir, 'customers.db'),
  autoload: true,
});

export const ordersDB = Datastore.create({
  filename: path.join(dataDir, 'orders.db'),
  autoload: true,
});

export const invoicesDB = Datastore.create({
  filename: path.join(dataDir, 'invoices.db'),
  autoload: true,
});

export const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[Database] No MONGODB_URI found, using NeDB storage.');
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log('[Database] MongoDB Atlas Connected Successfully!');
  } catch (err: any) {
    console.warn('[Database] MongoDB Atlas Connection Error (using NeDB fallback):', err.message);
  }
};

console.log('[Database] Embedded NeDB storage ready at:', dataDir);
