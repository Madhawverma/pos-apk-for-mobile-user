import { Request, Response } from 'express';
import { ordersDB, productsDB, customersDB, invoicesDB } from '../db';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const ordersList: any[] = await ordersDB.find({});
    const totalSales = ordersList.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalOrders = ordersList.length;
    const pendingOrders = ordersList.filter(
      (o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled'
    ).length;

    const productsList: any[] = await productsDB.find({});
    const lowStockCount = productsList.filter(
      (p) => (Number(p.stock) || 0) <= (Number(p.minStockAlert) || 5)
    ).length;

    const totalCustomers = await customersDB.count({});

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
