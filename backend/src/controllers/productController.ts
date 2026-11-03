import { Request, Response } from 'express';
import { productsDB } from '../db';
import { ProductModel } from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let query: any = {};

    if (category && typeof category === 'string' && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (search && typeof search === 'string') {
      const reg = new RegExp(search, 'i');
      query.$or = [{ name: reg }, { code: reg }, { brand: reg }, { barcode: reg }];
    }

    const items = await productsDB.find(query).sort({ createdAt: -1 });
    const formatted = items.map((item: any) => ({
      ...item,
      id: item.id || item._id,
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product: any = await productsDB.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }, { code: req.params.id }],
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: { ...product, id: product.id || product._id } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.name || !body.price || !body.category) {
      return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
    }

    const newProd = {
      id: body.id || `prod-${Date.now()}`,
      name: body.name,
      code: body.code || `SG-${Math.floor(1000 + Math.random() * 9000)}`,
      category: body.category,
      brand: body.brand || 'Generic',
      frameType: body.frameType,
      material: body.material,
      price: Number(body.price),
      costPrice: Number(body.costPrice || 0),
      stock: Number(body.stock || 0),
      minStockAlert: Number(body.minStockAlert || 5),
      barcode: body.barcode || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      description: body.description || '',
      image: body.image || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString(),
    };

    const inserted: any = await productsDB.insert(newProd);

    // Sync to MongoDB Atlas
    ProductModel.create({
      ...newProd,
      _id: undefined,
    }).catch((e) => console.log('[Atlas Product Sync]:', e.message));

    res.status(201).json({ success: true, data: { ...inserted, id: inserted.id || inserted._id } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };
    delete updateData._id;

    await productsDB.update(
      { $or: [{ id: req.params.id }, { _id: req.params.id }] },
      { $set: updateData },
      {}
    );

    const updated: any = await productsDB.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }],
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: { ...updated, id: updated.id || updated._id } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const numRemoved = await productsDB.remove(
      { $or: [{ id: req.params.id }, { _id: req.params.id }] },
      {}
    );
    if (numRemoved === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
