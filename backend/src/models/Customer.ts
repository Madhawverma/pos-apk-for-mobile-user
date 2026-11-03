import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  notes?: string;
  totalPurchases: number;
  totalSpent: number;
  status?: string;
  tenure?: string;
  avatarBg?: string;
  avatarColor?: string;
  prescriptions?: any[];
}

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    city: { type: String, default: 'Sehore' },
    notes: { type: String },
    totalPurchases: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    status: { type: String, default: 'Regular' },
    tenure: { type: String, default: 'New' },
    avatarBg: { type: String, default: '#DBEAFE' },
    avatarColor: { type: String, default: '#1D4ED8' },
    prescriptions: { type: [Schema.Types.Mixed], default: [] },
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
      }
    }
  }
);

export const CustomerModel = mongoose.model<ICustomer>('Customer', CustomerSchema);

