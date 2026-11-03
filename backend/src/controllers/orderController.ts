import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { ProductModel } from '../models/Product';
import { CustomerModel } from '../models/Customer';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const items = await OrderModel.find({}).sort({ createdAt: -1 });
    const formatted = items.map((o: any) => ({
      ...o.toObject(),
      id: o.orderNumber || o.id || o._id.toString(),
    }));
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let order: any = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await OrderModel.findById(id);
    }
    if (!order) {
      order = await OrderModel.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({
      success: true,
      data: { ...order.toObject(), id: order.orderNumber || order.id || order._id.toString() },
    });
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

    // Deduct stock in MongoDB Atlas
    for (const item of body.items) {
      const pid = item.product?.code || item.product?.id || item.product?._id;
      if (pid) {
        let filter: any = { code: pid };
        if (typeof pid === 'string' && pid.match(/^[0-9a-fA-F]{24}$/)) {
          filter = { $or: [{ _id: pid }, { code: pid }] };
        }
        await ProductModel.findOneAndUpdate(
          filter,
          { $inc: { stock: -Number(item.quantity || 1) } }
        );
      }
    }

    const orderNumber = body.orderNumber || `ORD-${Date.now().toString().slice(-6)}`;
    const subtotal = Number(body.subtotal || 0);
    const discount = Number(body.discount || 0);
    const tax = Number(body.tax || 0);
    const total = Number(body.total || subtotal - discount + tax);
    const advancePaid = Number(body.advancePaid || 0);
    const balanceDue = Number(body.balanceDue || total - advancePaid);

    const newOrder = await OrderModel.create({
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
      await CustomerModel.findOneAndUpdate(
        { phone: body.customer.phone },
        {
          $inc: { totalSpent: total, totalPurchases: 1 },
          $set: { tenure: 'Regular' },
        }
      );
    }

    res.status(201).json({
      success: true,
      data: { ...newOrder.toObject(), id: newOrder.orderNumber || newOrder.id || newOrder._id.toString() },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let filter: any = { orderNumber: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      filter = { $or: [{ _id: id }, { orderNumber: id }] };
    }

    const { orderStatus, paymentStatus, balanceDue } = req.body;
    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (balanceDue !== undefined) updateData.balanceDue = Number(balanceDue);

    const updated = await OrderModel.findOneAndUpdate(filter, { $set: updateData }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      data: { ...updated.toObject(), id: updated.orderNumber || updated.id || updated._id.toString() },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
