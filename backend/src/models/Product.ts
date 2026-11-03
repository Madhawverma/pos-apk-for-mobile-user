import mongoose, { Schema, Document } from 'mongoose';
import { ProductCategory } from '../types';

export interface IProduct extends Document {
  name: string;
  code: string;
  category: ProductCategory;
  brand: string;
  frameType?: string;
  material?: string;
  price: number;
  costPrice: number;
  stock: number;
  minStockAlert: number;
  barcode: string;
  description?: string;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    brand: { type: String, default: 'Generic' },
    frameType: { type: String },
    material: { type: String },
    price: { type: Number, required: true },
    costPrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    minStockAlert: { type: Number, default: 5 },
    barcode: { type: String, required: true },
    description: { type: String }
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

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);

