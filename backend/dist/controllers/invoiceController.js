"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInvoice = exports.createInvoice = exports.getInvoiceById = exports.getInvoices = void 0;
const Invoice_1 = require("../models/Invoice");
const SHOP_HEADER = '🙏 *श्री गणेश ऑप्टिकल, सीहोर* 🙏';
const SHOP_ADDRESS = '_ASG Eye Hospital के पास, इंग्लिशपुरा, सीहोर (म.प्र.)_';
const SHOP_PHONE = '📞 संपर्क: +91 6263732857';
const getInvoices = async (req, res) => {
    try {
        const items = await Invoice_1.InvoiceModel.find({}).sort({ createdAt: -1 });
        const formatted = items.map((inv) => ({
            ...inv.toObject(),
            id: inv.invoiceNumber || inv.id || inv._id.toString(),
            shopAddress: 'ASG Eye Hospital के पास, इंग्लिशपुरा, सीहोर (म.प्र.)',
            shopPhone: '+91 6263732857',
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
        const invObj = invoice.toObject();
        const customerName = invObj.customerName || invObj.customer?.name || 'Customer';
        const items = invObj.items || [];
        const itemsFormatted = items
            .map((it, idx) => `${idx + 1}. *${it.description}*\n   Qty: ${it.qty} × ₹${Number(it.unitPrice || it.amount / it.qty).toLocaleString('en-IN')} = *₹${Number(it.amount).toLocaleString('en-IN')}*`)
            .join('\n');
        const totalPaid = invObj.paidAmount !== undefined ? invObj.paidAmount : invObj.total;
        const dueAmount = invObj.dueAmount || 0;
        const statusText = dueAmount <= 0 ? 'सफल / PAID ✓' : 'बाकी / DUE';
        // WhatsApp Bill Template generated completely from backend
        const whatsappMessage = `${SHOP_HEADER}
${SHOP_ADDRESS}
${SHOP_PHONE}
━━━━━━━━━━━━━━━━━━━━
प्रिय *${customerName}* जी, नमस्ते! 🙏

*श्री गणेश ऑप्टिकल से खरीदारी करने के लिए आपका बहुत-बहुत धन्यवाद!* 👓✨

और भी शानदार एवं बेस्ट क्वालिटी के चश्मे (Frames, Sunglasses, Lenses) खरीदने के लिए हमेशा हमसे संपर्क करें।
━━━━━━━━━━━━━━━━━━━━
📄 *बिल / रसीद विवरण:*
• बिल संख्या (Invoice No): *${invObj.invoiceNumber}*
• दिनांक (Date): *${invObj.date}*
• समय (Time): *${invObj.time}*
• भुगतान का माध्यम: *${invObj.paymentMethod || 'Cash'}*
• कुल भुगतान (Total Paid): *₹${Number(totalPaid).toLocaleString('en-IN')}*
• स्थिति (Status): *${statusText}*
${dueAmount > 0 ? `• शेष राशि (Due): *₹${Number(dueAmount).toLocaleString('en-IN')}*\n` : ''}
🛒 *खरीदे गए उत्पाद (Items):*
${itemsFormatted}
━━━━━━━━━━━━━━━━━━━━
📎 *आपकी इनवॉइस रसीद (PDF Bill) संलग्न है, कृपया चेक करें।* 📄

श्री गणेश ऑप्टिकल आपके उत्तम स्वास्थ्य व सुंदर दृष्टि की कामना करता है! 💐`;
        res.json({
            success: true,
            data: {
                ...invObj,
                id: invObj.invoiceNumber || invObj.id || invObj._id.toString(),
                tax: 0, // Tax removed as requested
                shopAddress: 'ASG Eye Hospital के पास, इंग्लिशपुरा, सीहोर (म.प्र.)',
                shopPhone: '+91 6263732857',
                whatsappMessage,
            },
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
        const subtotal = Number(body.subtotal || body.total || 0);
        const discount = Number(body.discount || 0);
        const total = Number(body.total || subtotal - discount);
        const newInvoice = await Invoice_1.InvoiceModel.create({
            invoiceNumber: invNumber,
            date: body.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: body.time || new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            customer: body.customer,
            customerName: body.customerName || body.customer?.name || 'Customer',
            customerPhone: body.customerPhone || body.customer?.phone || '',
            itemCount: body.itemCount || body.items?.length || 1,
            itemType: body.itemType || 'frame',
            items: body.items || [],
            subtotal,
            discount,
            tax: 0, // Tax completely removed from bill calculation
            total,
            paidAmount: Number(body.paidAmount !== undefined ? body.paidAmount : total),
            dueAmount: Number(body.dueAmount || 0),
            status: body.status || 'Paid',
            paymentMethod: body.paymentMethod || 'Cash',
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
