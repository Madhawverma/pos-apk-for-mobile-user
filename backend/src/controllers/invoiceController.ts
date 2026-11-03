import { Request, Response } from 'express';
import { invoicesDB } from '../db';
import { InvoiceModel } from '../models/Invoice';

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const items = await invoicesDB.find({}).sort({ createdAt: -1 });
    const formatted = items.map((inv: any) => ({
      ...inv,
      id: inv.id || inv._id,
    }));
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const invoice: any = await invoicesDB.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }, { invoiceNumber: req.params.id }],
    });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, data: { ...invoice, id: invoice.id || invoice._id } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const invNumber = body.invoiceNumber || `MG-2627-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice = {
      id: body.id || `inv-${Date.now()}`,
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
      paymentMethod: body.paymentMethod || 'Cash',
      createdAt: new Date().toISOString(),
    };

    const inserted: any = await invoicesDB.insert(newInvoice);

    // Sync to MongoDB Atlas
    InvoiceModel.create({
      ...newInvoice,
      _id: undefined,
    }).catch((e) => console.log('[Atlas Invoice Sync]:', e.message));

    res.status(201).json({ success: true, data: { ...inserted, id: inserted.id || inserted._id } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
