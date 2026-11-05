/**
 * API Service for communicating with the Node.js/Express Backend Server
 */

// Current Local IP of this machine on Wi-Fi
export const CURRENT_WIFI_URL = 'http://192.168.1.26:5000/api';

// Render Production URL, Localhost fallback and local Wi-Fi IP for testing
export const RENDER_URL = process.env.EXPO_PUBLIC_API_URL || 'https://pos-apk-for-mobile-user-1.onrender.com/api';
export const LOCAL_BASE_URL = 'http://127.0.0.1:5000/api';
export const LOCALHOST_URL = 'http://localhost:5000/api';
export const API_BASE_URL = 'http://10.52.100.127:5000/api';

// Secret Security Key to authorize mobile app with backend
const API_SECRET_KEY = process.env.EXPO_PUBLIC_API_KEY || 'shree-ganesh-optical-secret-key-2026';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  // Always try active Render production URL first, then local fallbacks
  const candidateUrls = [RENDER_URL, LOCAL_BASE_URL, LOCALHOST_URL, CURRENT_WIFI_URL, API_BASE_URL];

  for (const baseUrl of candidateUrls) {
    try {
      const controller = new AbortController();
      const isRender = baseUrl.includes('onrender.com');
      const timeoutMs = isRender ? 15000 : 3500;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_SECRET_KEY,
          ...(options?.headers || {}),
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        return json.data !== undefined ? json.data : json;
      }
    } catch (e) {
      // Try next fallback URL or proceed to offline fallback
    }
  }

  return null;
}

export const apiService = {
  // Health
  checkHealth: () => request<{ status: string }>('/health'),

  // Auth / Login
  login: (credentials: { email?: string; identifier?: string; password?: string }) =>
    request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  changePassword: (data: { email: string; oldPassword: string; newPassword: string }) =>
    request<any>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Products
  getProducts: () => request<any[]>('/products'),
  createProduct: (product: any) =>
    request<any>('/products', { method: 'POST', body: JSON.stringify(product) }),
  updateProduct: (id: string, product: any) =>
    request<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
  deleteProduct: (id: string) =>
    request<any>(`/products/${id}`, { method: 'DELETE' }),

  // Customers
  getCustomers: () => request<any[]>('/customers'),
  createCustomer: (customer: any) =>
    request<any>('/customers', { method: 'POST', body: JSON.stringify(customer) }),
  updateCustomer: (id: string, customer: any) =>
    request<any>(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(customer) }),
  deleteCustomer: (id: string) =>
    request<any>(`/customers/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: () => request<any[]>('/orders'),
  createOrder: (order: any) =>
    request<any>('/orders', { method: 'POST', body: JSON.stringify(order) }),
  updateOrderStatus: (id: string, statusData: any) =>
    request<any>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(statusData) }),

  // Invoices
  getInvoices: () => request<any[]>('/invoices'),
  createInvoice: (invoice: any) =>
    request<any>('/invoices', { method: 'POST', body: JSON.stringify(invoice) }),

  // Dashboard Stats
  getDashboardStats: () => request<any>('/dashboard/stats'),
};
