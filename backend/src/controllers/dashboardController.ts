import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { ProductModel } from '../models/Product';
import { CustomerModel } from '../models/Customer';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const ordersList = await OrderModel.find({});
    const totalSales = ordersList.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalOrders = ordersList.length;
    const pendingOrders = ordersList.filter(
      (o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled'
    ).length;

    const productsList = await ProductModel.find({});
    const lowStockCount = productsList.filter(
      (p) => (Number(p.stock) || 0) <= (Number(p.minStockAlert) || 5)
    ).length;

    const totalCustomers = await CustomerModel.countDocuments({});

    res.json({
      success: true,
      shopName: process.env.SHOP_NAME || 'Shree Ganesh Optical',
      data: {
        totalSales,
        totalOrders,
        pendingOrders,
        lowStockCount,
        totalProducts: productsList.length,
        totalCustomers,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
