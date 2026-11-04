"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const Customer_1 = require("../models/Customer");
const getDashboardStats = async (req, res) => {
    try {
        const ordersList = await Order_1.OrderModel.find({});
        const totalSales = ordersList.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        const totalOrders = ordersList.length;
        const pendingOrders = ordersList.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;
        const productsList = await Product_1.ProductModel.find({});
        const lowStockCount = productsList.filter((p) => (Number(p.stock) || 0) <= (Number(p.minStockAlert) || 5)).length;
        const totalCustomers = await Customer_1.CustomerModel.countDocuments({});
        res.json({
            success: true,
            shopName: process.env.SHOP_NAME || 'Shree Ganesh Optical',
            data: {
                totalSales,
                totalOrders,
                pendingOrders,
                lowStockCount,
                totalProducts: productsList.length,
                totalCustomers,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
