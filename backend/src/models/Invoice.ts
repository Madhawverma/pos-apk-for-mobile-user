import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  date: string;
  time: string;
  customer: {
    id?: string;
    name: string;
    phone: string;
    initials?: string;
    avatarBg?: string;
    avatarColor?: string;
    email?: string;
    address?: string;
  };
  customerName: string;
  customerPhone: string;
  itemCount: number;
  itemType: string;
  items: IInvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  paymentMethod: string;
}

const InvoiceSchema: Schema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    time: { type: String, default: '12:00 PM' },
    customer: { type: Schema.Types.Mixed },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    itemCount: { type: Number, default: 1 },
    itemType: { type: String, default: 'frame' },
    items: [
      {
        description: { type: String, required: true },
        qty: { type: Number, required: true, default: 1 },
        unitPrice: { type: Number, required: true },
        amount: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    status: { type: String, default: 'Paid' },
    paymentMethod: { type: String, default: 'Cash' },
    costPrice: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: Record<string, any>) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const InvoiceModel = mongoose.model<IInvoice>('Invoice', InvoiceSchema);

