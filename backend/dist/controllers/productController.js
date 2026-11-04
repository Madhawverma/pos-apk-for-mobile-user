"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = require("../models/Product");
const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        if (category && typeof category === 'string' && category !== 'All') {
            query.category = new RegExp(`^${category}$`, 'i');
        }
        if (search && typeof search === 'string') {
            const reg = new RegExp(search, 'i');
            query.$or = [{ name: reg }, { code: reg }, { brand: reg }, { barcode: reg }];
        }
        const items = await Product_1.ProductModel.find(query).sort({ createdAt: -1 });
        const formatted = items.map((item) => ({
            ...item.toObject(),
            id: item.code || item.id || item._id.toString(),
        }));
        res.json({ success: true, count: formatted.length, data: formatted });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        let product = null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product_1.ProductModel.findById(id);
        }
        if (!product) {
            product = await Product_1.ProductModel.findOne({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const body = req.body;
        if (!body.name || !body.price || !body.category) {
            return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
        }
        const code = body.code || `SG-${Math.floor(1000 + Math.random() * 9000)}`;
        const barcode = body.barcode || `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
        const newProd = await Product_1.ProductModel.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        let filter = { code: id };
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            filter = { $or: [{ _id: id }, { code: id }] };
        }
        const updated = await Product_1.ProductModel.findOneAndUpdate(filter, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({
            success: true,
            data: { ...updated.toObject(), id: updated.code || updated.id || updated._id.toString() },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        let filter = { code: id };
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            filter = { $or: [{ _id: id }, { code: id }] };
        }
        const deleted = await Product_1.ProductModel.findOneAndDelete(filter);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteProduct = deleteProduct;
