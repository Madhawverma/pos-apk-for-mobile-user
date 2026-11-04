"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomerById = exports.getCustomers = void 0;
const Customer_1 = require("../models/Customer");
const getCustomers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search && typeof search === 'string') {
            const reg = new RegExp(search, 'i');
            query.$or = [{ name: reg }, { phone: reg }, { email: reg }];
        }
        const items = await Customer_1.CustomerModel.find(query).sort({ createdAt: -1 });
        const formatted = items.map((c) => ({
            ...c.toObject(),
            id: c.id || c._id.toString(),
        }));
        res.json({ success: true, count: formatted.length, data: formatted });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCustomers = getCustomers;
const getCustomerById = async (req, res) => {
    try {
        const id = req.params.id;
        let customer = null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            customer = await Customer_1.CustomerModel.findById(id);
        }
        if (!customer) {
            customer = await Customer_1.CustomerModel.findOne({
                $or: [{ phone: id }],
            });
        }
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.json({ success: true, data: { ...customer.toObject(), id: customer.id || customer._id.toString() } });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCustomerById = getCustomerById;
const createCustomer = async (req, res) => {
    try {
        const { name, phone, email, address, city, notes, prescriptions } = req.body;
        if (!name || !phone) {
            return res.status(400).json({ success: false, message: 'Name and phone are required' });
        }
        const newCustomer = await Customer_1.CustomerModel.create({
            name,
            phone,
            email: email || '',
            address: address || 'Sehore, MP',
            city: city || 'Sehore',
            notes: notes || '',
            totalSpent: 0,
            totalPurchases: 0,
            prescriptions: prescriptions || [],
        });
        res.status(201).json({
            success: true,
            data: { ...newCustomer.toObject(), id: newCustomer.id || newCustomer._id.toString() },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createCustomer = createCustomer;
const updateCustomer = async (req, res) => {
    try {
        const id = req.params.id;
        let filter = { phone: id };
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            filter = { $or: [{ _id: id }, { phone: id }] };
        }
        const updated = await Customer_1.CustomerModel.findOneAndUpdate(filter, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.json({
            success: true,
            data: { ...updated.toObject(), id: updated.id || updated._id.toString() },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res) => {
    try {
        const id = req.params.id;
        let filter = { phone: id };
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            filter = { $or: [{ _id: id }, { phone: id }] };
        }
        const deleted = await Customer_1.CustomerModel.findOneAndDelete(filter);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.json({ success: true, message: 'Customer deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteCustomer = deleteCustomer;
