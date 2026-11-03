import { Request, Response } from 'express';
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

    const items = await ProductModel.find(query).sort({ createdAt: -1 });
    const formatted = items.map((item: any) => ({
      ...item.toObject(),
      id: item.code || item.id || item._id.toString(),
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let product: any = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await ProductModel.findById(id);
    }
    if (!product) {
      product = await ProductModel.findOne({
        $or: [{ code: id }, { barcode: id }],
      });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({
      success: true,
      data: { ...product.toObject(), id: product.code || product.id || product._id.toString() },
    });
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

    const code = body.code || `SG-${Math.floor(1000 + Math.random() * 9000)}`;
    const barcode = body.barcode || `${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    const newProd = await ProductModel.create({
      name: body.name,
      code,
      category: body.category,
      brand: body.brand || 'Generic',
      frameType: body.frameType,
      material: body.material,
      price: Number(body.price),
      costPrice: Number(body.costPrice || 0),
      stock: Number(body.stock || 0),
      minStockAlert: Number(body.minStockAlert || 5),
      barcode,
      description: body.description || '',
    });

    res.status(201).json({
      success: true,
      data: { ...newProd.toObject(), id: newProd.code || newProd.id || newProd._id.toString() },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let filter: any = { code: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      filter = { $or: [{ _id: id }, { code: id }] };
    }

    const updated = await ProductModel.findOneAndUpdate(filter, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: { ...updated.toObject(), id: updated.code || updated.id || updated._id.toString() },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let filter: any = { code: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      filter = { $or: [{ _id: id }, { code: id }] };
    }

    const deleted = await ProductModel.findOneAndDelete(filter);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
