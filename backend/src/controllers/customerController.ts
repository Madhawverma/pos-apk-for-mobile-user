import { Request, Response } from 'express';
import { CustomerModel } from '../models/Customer';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let query: any = {};

    if (search && typeof search === 'string') {
      const reg = new RegExp(search, 'i');
      query.$or = [{ name: reg }, { phone: reg }, { email: reg }];
    }

    const items = await CustomerModel.find(query).sort({ createdAt: -1 });
    const formatted = items.map((c: any) => ({
      ...c.toObject(),
      id: c.id || c._id.toString(),
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let customer: any = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      customer = await CustomerModel.findById(id);
    }
    if (!customer) {
      customer = await CustomerModel.findOne({
        $or: [{ phone: id }],
      });
    }

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, data: { ...customer.toObject(), id: customer.id || customer._id.toString() } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, address, city, notes, prescriptions } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    const newCustomer = await CustomerModel.create({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let filter: any = { phone: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      filter = { $or: [{ _id: id }, { phone: id }] };
    }

    const updated = await CustomerModel.findOneAndUpdate(filter, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({
      success: true,
      data: { ...updated.toObject(), id: updated.id || updated._id.toString() },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let filter: any = { phone: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      filter = { $or: [{ _id: id }, { phone: id }] };
    }

    const deleted = await CustomerModel.findOneAndDelete(filter);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
