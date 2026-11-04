"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInvoice = exports.createInvoice = exports.getInvoiceById = exports.getInvoices = void 0;
const Invoice_1 = require("../models/Invoice");
const getInvoices = async (req, res) => {
    try {
        const items = await Invoice_1.InvoiceModel.find({}).sort({ createdAt: -1 });
        const formatted = items.map((inv) => ({
            ...inv.toObject(),
            id: inv.invoiceNumber || inv.id || inv._id.toString(),
        }));
        res.json({ success: true, count: formatted.length, data: formatted });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getInvoices = getInvoices;
const getInvoiceById = async (req, res) => {
    try {
        const id = req.params.id;
        let invoice = null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            invoice = await Invoice_1.InvoiceModel.findById(id);
        }
        if (!invoice) {
            invoice = await Invoice_1.InvoiceModel.findOne({ invoiceNumber: id });
        }
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }
        res.json({
            success: true,
            data: { ...invoice.toObject(), id: invoice.invoiceNumber || invoice.id || invoice._id.toString() },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getInvoiceById = getInvoiceById;
const createInvoice = async (req, res) => {
    try {
        const body = req.body;
        let invNumber = body.invoiceNumber;
        if (!invNumber) {
            // Find highest existing invoice number sequentially
            const lastInvoices = await Invoice_1.InvoiceModel.find({}).select('invoiceNumber');
            let maxNum = 0;
            lastInvoices.forEach((inv) => {
                if (inv && inv.invoiceNumber) {
                    const match = inv.invoiceNumber.match(/INV(\d+)/i) || inv.invoiceNumber.match(/(\d+)/);
                    if (match && match[1]) {
                        const parsed = parseInt(match[1], 10);
                        if (!isNaN(parsed) && parsed > maxNum)
                            maxNum = parsed;
                    }
                }
            });
            const nextSeq = maxNum + 1;
            invNumber = `INV${String(nextSeq).padStart(5, '0')}`;
        }
        const newInvoice = await Invoice_1.InvoiceModel.create({
            invoiceNumber: invNumber,
            date: body.date || new Date().toLocaleDateString('en-GB'),
            time: body.time || new Date().toLocaleTimeString('en-US'),
            customer: body.customer,
            customerName: body.customerName || body.customer?.name || 'Customer',
            customerPhone: body.customerPhone || body.customer?.phone || '',
            itemCount: body.itemCount || body.items?.length || 1,
            itemType: body.itemType || 'frame',
            items: body.items || [],
            total: Number(body.total || 0),
            paidAmount: Number(body.paidAmount || body.total || 0),
            dueAmount: Number(body.dueAmount || 0),
            status: body.status || 'Paid',
            paymentMethod: body.paymentMethod || 'UPI',
        });
        res.status(201).json({
            success: true,
            data: { ...newInvoice.toObject(), id: newInvoice.invoiceNumber || newInvoice.id || newInvoice._id.toString() },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createInvoice = createInvoice;
const updateInvoice = async (req, res) => {
    try {
        const id = req.params.id;
        let filter = { invoiceNumber: id };
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            filter = { $or: [{ _id: id }, { invoiceNumber: id }] };
        }
        const updated = await Invoice_1.InvoiceModel.findOneAndUpdate(filter, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }
        res.json({
            success: true,
            data: { ...updated.toObject(), id: updated.invoiceNumber || updated.id || updated._id.toString() },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateInvoice = updateInvoice;
