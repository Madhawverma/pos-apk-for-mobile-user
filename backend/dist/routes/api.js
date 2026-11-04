"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const customerController_1 = require("../controllers/customerController");
const orderController_1 = require("../controllers/orderController");
const invoiceController_1 = require("../controllers/invoiceController");
const dashboardController_1 = require("../controllers/dashboardController");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Health Check
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        store: 'Shree Ganesh Optical, Sehore',
        timestamp: new Date().toISOString(),
    });
});
// Authentication
router.post('/auth/login', authController_1.login);
router.post('/auth/change-password', authController_1.changePassword);
// Products
router.get('/products', productController_1.getProducts);
router.get('/products/:id', productController_1.getProductById);
router.post('/products', productController_1.createProduct);
router.put('/products/:id', productController_1.updateProduct);
router.delete('/products/:id', productController_1.deleteProduct);
// Customers
router.get('/customers', customerController_1.getCustomers);
router.get('/customers/:id', customerController_1.getCustomerById);
router.post('/customers', customerController_1.createCustomer);
router.put('/customers/:id', customerController_1.updateCustomer);
// Orders
router.get('/orders', orderController_1.getOrders);
router.get('/orders/:id', orderController_1.getOrderById);
router.post('/orders', orderController_1.createOrder);
router.patch('/orders/:id/status', orderController_1.updateOrderStatus);
// Invoices
router.get('/invoices', invoiceController_1.getInvoices);
router.get('/invoices/:id', invoiceController_1.getInvoiceById);
router.post('/invoices', invoiceController_1.createInvoice);
// Dashboard
router.get('/dashboard/stats', dashboardController_1.getDashboardStats);
exports.default = router;
