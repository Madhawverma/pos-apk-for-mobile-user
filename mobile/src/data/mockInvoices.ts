export type InvoiceStatus = 'Paid' | 'Pending' | 'Cancelled' | 'Partial' | 'Unpaid';

export type InvoiceItemType =
  | 'frame'
  | 'sunglasses'
  | 'lens'
  | 'tortoise'
  | 'contact_lens'
  | 'photochromic'
  | 'pink_frame';

export interface InvoiceItemDetail {
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  time: string;
  customer: {
    name: string;
    phone: string;
    initials: string;
    avatarBg: string;
    avatarColor: string;
    email?: string;
    address?: string;
  };
  customerName: string;
  customerPhone: string;
  itemCount: number;
  itemType: InvoiceItemType;
  items: InvoiceItemDetail[];
  total: number;
  paidAmount: number;
  dueAmount: number;
  status: InvoiceStatus;
  paymentMethod?: 'UPI' | 'Card' | 'Cash';
  pendingAmount?: number;
  costPrice?: number;
  profit?: number;
}

export type InvoiceRecord = Invoice;

export const mockInvoices: Invoice[] = [];
