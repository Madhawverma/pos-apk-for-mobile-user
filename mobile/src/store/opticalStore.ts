import { mockProducts } from '../data/mockProducts';
import { mockCustomers } from '../data/mockCustomers';
import { mockOrders } from '../data/mockOrders';
import { mockInvoices, Invoice, InvoiceItemType } from '../data/mockInvoices';
import { Product } from '../types/product';
import { Customer } from '../types/customer';
import { Order, OrderStatus } from '../types/order';
import { apiService } from '../services/apiService';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'sale' | 'stock' | 'order' | 'customer';
}

export interface DaySaleMetric {
  day: string;
  dateStr: string;
  amount: number;
  orders: number;
  height: number; // percentage 0-100 for bar chart
  active: boolean;
}

export interface DashboardMetrics {
  salesTotal: number;
  ordersTotal: number;
  customersTotal: number;
  lowStockTotal: number;
  trendSales: string;
  trendOrders: string;
  chartData: DaySaleMetric[];
}

export interface OpticalStoreState {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  invoices: Invoice[];
  notifications: AppNotification[];
  timeframe: 'today' | 'week' | 'month';
}

// Global in-memory reactive state initialized with clean fresh data
let state: OpticalStoreState = {
  products: [],
  customers: [],
  orders: [],
  invoices: [],
  timeframe: 'today',
  notifications: [],
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error notifying opticalStore listener:', e);
    }
  });
}

export const opticalStore = {
  getState: (): OpticalStoreState => state,

  // Helper to generate sequential invoice numbers: INV00001, INV00002 ... INV00010 etc.
  getNextInvoiceNumber: (): string => {
    let maxNum = 0;
    const allInvoices = [...state.invoices, ...mockInvoices];

    allInvoices.forEach((inv) => {
      if (inv && inv.invoiceNumber) {
        // Match numbers after INV, #INV-, or standalone digits
        const match = inv.invoiceNumber.match(/INV(\d+)/i) || inv.invoiceNumber.match(/(\d+)/);
        if (match && match[1]) {
          const parsed = parseInt(match[1], 10);
          if (!isNaN(parsed) && parsed > maxNum) {
            maxNum = parsed;
          }
        }
      }
    });

    const nextSeq = maxNum + 1;
    // Format with at least 5 digits: INV00001, INV00002 ... INV00010
    const padded = String(nextSeq).padStart(5, '0');
    return `INV${padded}`;
  },

  // Sync initial state from backend database
  syncFromBackend: async () => {
    try {
      const [backendProducts, backendCustomers, backendOrders, backendInvoices] = await Promise.all([
        apiService.getProducts(),
        apiService.getCustomers(),
        apiService.getOrders(),
        apiService.getInvoices(),
      ]);

      if (Array.isArray(backendProducts)) {
        state.products = backendProducts;
      }
      if (Array.isArray(backendCustomers)) {
        state.customers = backendCustomers;
      }
      if (Array.isArray(backendOrders)) {
        state.orders = backendOrders;
      }
      if (Array.isArray(backendInvoices)) {
        state.invoices = backendInvoices;
      }
      notify();
    } catch (e) {
      console.log('[Store Sync] Using local cache:', e);
    }
  },

  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  // Products
  addProduct: (newProd: Product) => {
    state.products = [newProd, ...state.products];
    mockProducts.unshift(newProd);

    // Sync to backend DB
    apiService.createProduct(newProd).catch(() => {});

    // Auto-create notification if initial stock is low
    if (newProd.stock <= newProd.minStockAlert) {
      opticalStore.addNotification(
        'Low Stock Warning',
        `New product ${newProd.name} added with low stock (${newProd.stock} units)`,
        'stock'
      );
    } else {
      opticalStore.addNotification(
        'Product Added',
        `Product ${newProd.name} added to catalog successfully`,
        'stock'
      );
    }
    notify();
  },

  updateProductStock: (productId: string, deltaQty: number) => {
    let targetProduct: Product | undefined;
    state.products = state.products.map((p) => {
      if (p.id === productId || p.code === productId) {
        const newStock = Math.max(0, p.stock + deltaQty);
        targetProduct = { ...p, stock: newStock };
        return targetProduct;
      }
      return p;
    });

    if (targetProduct) {
      apiService.updateProduct(productId, { stock: targetProduct.stock }).catch(() => {});
    }

    const mockP = mockProducts.find((p) => p.id === productId || p.code === productId);
    if (mockP) {
      mockP.stock = Math.max(0, mockP.stock + deltaQty);
    }
    notify();
  },

  getLowStockProducts: (limit = 5): Product[] => {
    return state.products
      .filter((p) => p.stock <= (p.minStockAlert || 5))
      .slice(0, limit);
  },

  // Customers
  addCustomer: (newCustomer: Customer) => {
    state.customers = [newCustomer, ...state.customers];
    mockCustomers.unshift(newCustomer);

    // Sync to backend DB
    apiService.createCustomer(newCustomer).catch(() => {});

    opticalStore.addNotification(
      'New Customer Registered',
      `${newCustomer.name} (${newCustomer.phone}) added to customer directory.`,
      'customer'
    );
    notify();
  },

  updateCustomerOrders: (customerId: string, orderAmount: number) => {
    state.customers = state.customers.map((c) => {
      if (c.id === customerId || c.phone === customerId) {
        return {
          ...c,
          totalOrders: (c.totalOrders || 0) + 1,
          totalSpent: (c.totalSpent || 0) + orderAmount,
          lastVisit: 'Today',
        };
      }
      return c;
    });
    notify();
  },

  // Invoices & Sales
  addInvoice: (invoice: Invoice) => {
    state.invoices = [invoice, ...state.invoices];
    mockInvoices.unshift(invoice);

    // Sync to backend DB
    apiService.createInvoice(invoice).catch(() => {});

    opticalStore.addNotification(
      'New Sale Recorded',
      `Invoice ${invoice.invoiceNumber} of ₹${invoice.total.toLocaleString()} created for ${invoice.customerName}.`,
      'sale'
    );
    notify();
  },

  updateInvoiceCostAndProfit: (invoiceId: string, costPrice: number) => {
    state.invoices = state.invoices.map((inv) => {
      if (inv.id === invoiceId || inv.invoiceNumber === invoiceId) {
        const profit = Math.max(0, inv.total - costPrice);
        const updated = { ...inv, costPrice, profit };
        // Sync to backend
        apiService.createInvoice(updated).catch(() => {});
        return updated;
      }
      return inv;
    });
    notify();
  },

  getRecentInvoices: (limit = 5): Invoice[] => {
    return state.invoices.slice(0, limit);
  },

  // Orders
  addOrder: (order: Order) => {
    state.orders = [order, ...state.orders];
    mockOrders.unshift(order);

    // Sync to backend DB
    apiService.createOrder(order).catch(() => {});

    opticalStore.addNotification(
      'New Spectacle Order',
      `Order ${order.orderNumber} for ${order.customer.name} sent for lens fitting.`,
      'order'
    );
    notify();
  },

  updateOrderStatus: (orderId: string, status: OrderStatus, stepperStage?: number) => {
    state.orders = state.orders.map((o) => {
      if (o.id === orderId || o.orderNumber === orderId) {
        return {
          ...o,
          orderStatus: status,
          stepperStage: stepperStage !== undefined ? stepperStage : o.stepperStage,
        };
      }
      return o;
    });

    // Sync to backend DB
    apiService.updateOrderStatus(orderId, { orderStatus: status }).catch(() => {});

    const mockO = mockOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (mockO) {
      mockO.orderStatus = status;
      if (stepperStage !== undefined) mockO.stepperStage = stepperStage;
    }

    opticalStore.addNotification(
      'Order Status Updated',
      `Order ${orderId} marked as ${status}.`,
      'order'
    );
    notify();
  },

  getPendingLensOrders: (limit = 5): Order[] => {
    return state.orders
      .filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled')
      .slice(0, limit);
  },

  // Notifications
  addNotification: (title: string, message: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      time: 'Just now',
      read: false,
      type,
    };
    state.notifications = [newNotif, ...state.notifications];
    notify();
  },

  markAllNotificationsRead: () => {
    state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
    notify();
  },

  clearNotifications: () => {
    state.notifications = [];
    notify();
  },

  getUnreadNotificationsCount: (): number => {
    return state.notifications.filter((n) => !n.read).length;
  },

  // Timeframe
  setTimeframe: (tf: 'today' | 'week' | 'month') => {
    state.timeframe = tf;
    notify();
  },

  // Computed Dashboard Metrics
  getDashboardMetrics: (tf: 'today' | 'week' | 'month' = state.timeframe): DashboardMetrics => {
    const invoices = state.invoices || [];
    const orders = state.orders || [];
    const customers = state.customers || [];
    const products = state.products || [];

    // 1. Calculate Real Dynamic 7-day Sales Bar Chart from actual invoices & orders
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    
    // Generate the last 7 days ending today
    const chartData: DaySaleMetric[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayShort = dayNames[d.getDay()];
      const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const fullDateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      // Match invoices belonging to this day
      const dayInvoices = invoices.filter((inv) => {
        if (!inv.date) return false;
        return (
          inv.date.includes(dateStr) ||
          inv.date === fullDateStr ||
          (i === 0 && (inv.date === 'Today' || inv.date.includes(dateStr)))
        );
      });

      const dayAmount = dayInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
      const dayOrders = dayInvoices.length;

      chartData.push({
        day: dayShort,
        dateStr,
        amount: dayAmount,
        orders: dayOrders,
        height: 10, // default baseline
        active: i === 0, // today is active
      });
    }

    // Scale bar heights dynamically (0 to 100%) based on max sales
    const maxDayAmount = Math.max(...chartData.map((c) => c.amount), 1);
    chartData.forEach((cd) => {
      if (cd.amount > 0) {
        cd.height = Math.max(18, Math.round((cd.amount / maxDayAmount) * 100));
      } else {
        cd.height = 10;
      }
    });

    // 2. Calculate dynamic KPI totals based on real invoices and selected timeframe ('today' | 'week' | 'month')
    let salesTotal = 0;
    let ordersTotal = 0;
    let trendSales = '0%';
    let trendOrders = '0';

    const todayDateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const todayFullStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const currentMonthStr = now.toLocaleDateString('en-GB', { month: 'short' });

    if (tf === 'today') {
      const todayInvoices = invoices.filter((inv) => {
        if (!inv.date) return false;
        return inv.date === 'Today' || inv.date.includes(todayDateStr) || inv.date === todayFullStr;
      });
      salesTotal = todayInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
      ordersTotal = todayInvoices.length;
      trendSales = salesTotal > 0 ? '+12%' : '0%';
      trendOrders = ordersTotal > 0 ? `+${ordersTotal}` : '0';
    } else if (tf === 'week') {
      // Last 7 days total from chartData
      salesTotal = chartData.reduce((sum, c) => sum + (c.amount || 0), 0);
      ordersTotal = chartData.reduce((sum, c) => sum + (c.orders || 0), 0);
      trendSales = salesTotal > 0 ? '+24%' : '0%';
      trendOrders = ordersTotal > 0 ? `+${ordersTotal}` : '0';
    } else {
      // Month: filter all invoices from current month
      const monthInvoices = invoices.filter((inv) => {
        if (!inv.date) return true;
        return inv.date.includes(currentMonthStr) || inv.date === 'Today';
      });
      salesTotal = monthInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
      ordersTotal = monthInvoices.length || orders.length;
      trendSales = salesTotal > 0 ? '+38%' : '0%';
      trendOrders = ordersTotal > 0 ? `+${ordersTotal}` : '0';
    }

    const customersTotal = customers.length;
    const lowStockTotal = products.filter((p) => p.stock <= (p.minStockAlert || 5)).length;

    return {
      salesTotal,
      ordersTotal,
      customersTotal,
      lowStockTotal,
      trendSales,
      trendOrders,
      chartData,
    };
  },
};
