import mongoose, { Schema, Document } from 'mongoose';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../types';

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    id?: string;
    name: string;
    phone: string;
  };
  prescription?: any;
  items: Array<{
    product: any;
    quantity: number;
    price: number;
    lensCustomization?: string;
  }>;
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
  notes?: string;
}

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      id: { type: String },
      name: { type: String, required: true },
      phone: { type: String, required: true }
    },
    prescription: { type: Schema.Types.Mixed },
    items: [
      {
        product: { type: Schema.Types.Mixed, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        lensCustomization: { type: String }
      }
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    advancePaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    orderStatus: { type: String, default: 'Ready for Pickup' },
    paymentStatus: { type: String, default: 'Paid' },
    paymentMethod: { type: String, default: 'Cash' },
    expectedDeliveryDate: { type: String },
    notes: { type: String }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: Record<string, any>) => {
        ret.id = ret._id.toString();
        ret.createdAt = ret.createdAt?.toISOString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);

