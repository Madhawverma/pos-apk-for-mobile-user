import { Product } from './product';
import { Prescription } from './prescription';

export type OrderStatus =
  | 'Processing'
  | 'Fitting'
  | 'Fitting in Lab'
  | 'Ready'
  | 'Ready for Pickup'
  | 'Delivered'
  | 'Cancelled'
  | string;

export type PaymentStatus = 'Paid' | 'Partial (Advance)' | 'Due';
export type PaymentMethod = 'Cash' | 'UPI/QR' | 'UPI' | 'Card';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  lensCustomization?: string;
  subtitle?: string;
  tags?: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    tier?: string;
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
  notesDate?: string;
  notesStaff?: string;
  // Visual presentation helpers
  lensTag?: string;
  stepperStage?: number; // 1: Order, 2: Fitting, 3: Ready, 4: Delivered, -1: Cancelled
  lensDetails?: {
    lensType: string;
    lensMaterial: string;
    coating: string;
    brand: string;
    warranty: string;
    expectedDelivery: string;
  };
  paymentHistory?: {
    date: string;
    amount: number;
    mode: string;
    reference: string;
    status: 'Paid' | 'Pending';
  }[];
  deliveryDetails?: {
    expectedDate: string;
    deliveryMethod: string;
    status: string;
    notes: string;
  };
  timeline?: {
    time: string;
    text: string;
    dotColor: string;
    isPending?: boolean;
  }[];
}
