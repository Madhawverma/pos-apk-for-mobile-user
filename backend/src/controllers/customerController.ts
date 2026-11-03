import { Request, Response } from 'express';
import { customersDB } from '../db';
import { CustomerModel } from '../models/Customer';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let query: any = {};

    if (search && typeof search === 'string') {
      const reg = new RegExp(search, 'i');
      query.$or = [{ name: reg }, { phone: reg }, { email: reg }];
    }

    const items = await customersDB.find(query).sort({ createdAt: -1 });
    const formatted = items.map((c: any) => ({
      ...c,
      id: c.id || c._id,
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer: any = await customersDB.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }, { phone: req.params.id }],
    });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, data: { ...customer, id: customer.id || customer._id } });
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

    const newCustomer = {
      id: req.body.id || `cust-${Date.now()}`,
      name,
      phone,
      email: email || '',
      address: address || 'Sehore, MP',
      city: city || 'Sehore',
      notes: notes || '',
      totalSpent: 0,
      totalPurchases: 0,
      prescriptions: prescriptions || [],
      createdAt: new Date().toISOString(),
    };

    const inserted: any = await customersDB.insert(newCustomer);

    // Sync to MongoDB Atlas in background
    CustomerModel.create(newCustomer).catch((e) => console.log('[Atlas Sync Error]:', e.message));

    res.status(201).json({ success: true, data: { ...inserted, id: inserted.id || inserted._id } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };
    delete updateData._id;

    await customersDB.update(
      { $or: [{ id: req.params.id }, { _id: req.params.id }] },
      { $set: updateData },
      {}
    );

    // Sync to MongoDB Atlas
    CustomerModel.updateOne(
      { $or: [{ phone: updateData.phone }, { name: updateData.name }] },
      { $set: updateData }
    ).catch(() => {});

    const updated: any = await customersDB.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }],
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, data: { ...updated, id: updated.id || updated._id } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
