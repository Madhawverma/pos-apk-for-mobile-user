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
  image?: string;
  images?: string[];
  emoji?: string;
}
