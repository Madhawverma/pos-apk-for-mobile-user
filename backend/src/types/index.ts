export type ProductCategory = 
  | 'Frames'
  | 'Sunglasses'
  | 'Lenses'
  | 'Prescription Lenses'
  | 'Contact Lenses'
  | 'Accessories'
  | 'Lens Solutions';

export interface Product {
  id: string;
  name: string;
  code: string;
  category: ProductCategory;
  brand: string;
  frameType?: 'Full Rim' | 'Semi-Rim' | 'Rimless' | string;
  material?: 'Acetate' | 'Titanium' | 'Metal' | 'TR90' | string;
  price: number;
  costPrice: number;
  stock: number;
  minStockAlert: number;
  barcode: string;
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  notes?: string;
  createdAt: string;
  totalPurchases?: number;
}

export interface EyePower {
  sph: string;
  cyl: string;
  axis: string;
  add?: string;
  va?: string;
}

export interface Prescription {
  id: string;
  customerId: string;
  rightEye: EyePower;
  leftEye: EyePower;
  pd?: string;
  notes?: string;
  doctorName?: string;
  date: string;
}

export type OrderStatus = 'Fitting in Lab' | 'Ready for Pickup' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Partial (Advance)' | 'Due';
export type PaymentMethod = 'Cash' | 'UPI/QR' | 'Card';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  lensCustomization?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  prescription?: Prescription;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  advancePaid: number;
  balanceDue: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  expectedDeliveryDate: string;
  createdAt: string;
  notes?: string;
}

