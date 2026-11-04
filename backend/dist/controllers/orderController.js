"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.createOrder = exports.getOrderById = exports.getOrders = void 0;
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const Customer_1 = require("../models/Customer");
const getOrders = async (req, res) => {
    try {
        const items = await Order_1.OrderModel.find({}).sort({ createdAt: -1 });
        const formatted = items.map((o) => ({
            ...o.toObject(),
            id: o.orderNumber || o.id || o._id.toString(),
        }));
        res.json({ success: true, count: formatted.length, data: formatted });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getOrders = getOrders;
const getOrderById = async (req, res) => {
    try {
        const id = req.params.id;
        let order = null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order_1.OrderModel.findById(id);
        }
        if (!order) {
            order = await Order_1.OrderModel.findOne({ orderNumber: id });
        }
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({
            success: true,
            data: { ...order.toObject(), id: order.orderNumber || order.id || order._id.toString() },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getOrderById = getOrderById;
const createOrder = async (req, res) => {
    try {
        const body = req.body;
        if (!body.items || !body.items.length || !body.customer) {
            return res.status(400).json({ success: false, message: 'Items and customer details are required' });
        }
        // Deduct stock in MongoDB Atlas
        for (const item of body.items) {
            const pid = item.product?.code || item.product?.id || item.product?._id;
            if (pid) {
                let filter = { code: pid };
                if (typeof pid === 'string' && pid.match(/^[0-9a-fA-F]{24}$/)) {
                    filter = { $or: [{ _id: pid }, { code: pid }] };
                }
                await Product_1.ProductModel.findOneAndUpdate(filter, { $inc: { stock: -Number(item.quantity || 1) } });
            }
        }
        const orderNumber = body.orderNumber || `ORD-${Date.now().toString().slice(-6)}`;
        const subtotal = Number(body.subtotal || 0);
        const discount = Number(body.discount || 0);
        const tax = Number(body.tax || 0);
        const total = Number(body.total || subtotal - discount + tax);
        const advancePaid = Number(body.advancePaid || 0);
        const balanceDue = Number(body.balanceDue || total - advancePaid);
        const newOrder = await Order_1.OrderModel.create({
            orderNumber,
            customer: {
                id: body.customer.id,
                name: body.customer.name,
                phone: body.customer.phone,
            },
            prescription: body.prescription,
            items: body.items,
            subtotal,
            discount,
            tax,
            total,
            advancePaid,
            balanceDue,
            orderStatus: body.orderStatus || 'Pending',
            paymentStatus: body.paymentStatus || (balanceDue <= 0 ? 'Paid' : advancePaid > 0 ? 'Partial' : 'Pending'),
            paymentMethod: body.paymentMethod || 'Cash',
            expectedDeliveryDate: body.expectedDeliveryDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            notes: body.notes || '',
        });
        // Update customer stats in MongoDB
        if (body.customer?.phone) {
            await Customer_1.CustomerModel.findOneAndUpdate({ phone: body.customer.phone }, {
                $inc: { totalSpent: total, totalPurchases: 1 },
                $set: { tenure: 'Regular' },
            });
        }
        res.status(201).json({
            success: true,
            data: { ...newOrder.toObject(), id: newOrder.orderNumber || newOrder.id || newOrder._id.toString() },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createOrder = createOrder;
const updateOrderStatus = async (req, res) => {
    try {
        const id = req.params.id;
        let filter = { orderNumber: id };
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            filter = { $or: [{ _id: id }, { orderNumber: id }] };
        }
        const { orderStatus, paymentStatus, balanceDue } = req.body;
        const updateData = {};
        if (orderStatus)
            updateData.orderStatus = orderStatus;
        if (paymentStatus)
            updateData.paymentStatus = paymentStatus;
        if (balanceDue !== undefined)
            updateData.balanceDue = Number(balanceDue);
        const updated = await Order_1.OrderModel.findOneAndUpdate(filter, { $set: updateData }, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({
            success: true,
            data: { ...updated.toObject(), id: updated.orderNumber || updated.id || updated._id.toString() },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateOrderStatus = updateOrderStatus;
