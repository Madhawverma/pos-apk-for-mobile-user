import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
} from '../controllers/customerController';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from '../controllers/orderController';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
} from '../controllers/invoiceController';
import { getDashboardStats } from '../controllers/dashboardController';
import { login, changePassword } from '../controllers/authController';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    store: 'Shree Ganesh Optical, Sehore',
    timestamp: new Date().toISOString(),
  });
});

// Authentication
router.post('/auth/login', login);
router.post('/auth/change-password', changePassword);

// Products
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Customers
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers', createCustomer);
router.put('/customers/:id', updateCustomer);

// Orders
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.post('/orders', createOrder);
router.patch('/orders/:id/status', updateOrderStatus);

// Invoices
router.get('/invoices', getInvoices);
router.get('/invoices/:id', getInvoiceById);
router.post('/invoices', createInvoice);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

export default router;
