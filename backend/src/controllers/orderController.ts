import { Request, Response } from 'express';
import { ordersDB, productsDB, customersDB } from '../db';
import { OrderModel } from '../models/Order';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const items = await ordersDB.find({}).sort({ createdAt: -1 });
    const formatted = items.map((o: any) => ({
      ...o,
      id: o.id || o._id,
    }));
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order: any = await ordersDB.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }, { orderNumber: req.params.id }],
    });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: { ...order, id: order.id || order._id } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.items || !body.items.length || !body.customer) {
      return res.status(400).json({ success: false, message: 'Items and customer details are required' });
    }

    // Deduct stock for each sold product
    for (const item of body.items) {
      const pid = item.product?.id || item.product?._id;
      if (pid) {
        const prod: any = await productsDB.findOne({ $or: [{ id: pid }, { _id: pid }] });
        if (prod) {
          const newStock = Math.max(0, (prod.stock || 0) - Number(item.quantity || 1));
          await productsDB.update({ _id: prod._id }, { $set: { stock: newStock } }, {});
        }
      }
    }

    // Update customer total purchases
    const custId = body.customer?.id || body.customer?._id;
    if (custId) {
      const cust: any = await customersDB.findOne({ $or: [{ id: custId }, { _id: custId }, { phone: body.customer?.phone }] });
      if (cust) {
        const spent = (cust.totalSpent || 0) + Number(body.total || 0);
        const count = (cust.totalPurchases || 0) + 1;
        await customersDB.update({ _id: cust._id }, { $set: { totalSpent: spent, totalPurchases: count } }, {});
      }
    }

    const orderNumber = body.orderNumber || `#ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: body.id || `ord-${Date.now()}`,
      orderNumber,
      customer: body.customer,
      prescription: body.prescription,
      items: body.items,
      subtotal: body.subtotal,
      discount: body.discount || 0,
      tax: body.tax || 0,
      total: body.total,
      advancePaid: body.advancePaid || 0,
      balanceDue: body.balanceDue || 0,
      orderStatus: body.orderStatus || 'Processing',
      paymentStatus: body.paymentStatus || 'Paid',
      paymentMethod: body.paymentMethod || 'Cash',
      expectedDeliveryDate: body.expectedDeliveryDate || 'Tomorrow',
      notes: body.notes || '',
      stepperStage: body.stepperStage || 1,
      createdAt: new Date().toISOString(),
    };

    const inserted: any = await ordersDB.insert(newOrder);

    // Sync to MongoDB Atlas
    OrderModel.create({
      ...newOrder,
      _id: undefined,
    }).catch((e) => console.log('[Atlas Order Sync]:', e.message));

    res.status(201).json({ success: true, data: { ...inserted, id: inserted.id || inserted._id } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderStatus, paymentStatus, balanceDue } = req.body;
    const updateData: any = { updatedAt: new Date().toISOString() };
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (balanceDue !== undefined) updateData.balanceDue = balanceDue;

    await ordersDB.update(
      { $or: [{ id: req.params.id }, { _id: req.params.id }, { orderNumber: req.params.id }] },
      { $set: updateData },
      {}
    );

    const updated: any = await ordersDB.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }, { orderNumber: req.params.id }],
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: { ...updated, id: updated.id || updated._id } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
