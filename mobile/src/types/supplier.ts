export type SupplierStatus = 'Active' | 'Inactive';

export interface Supplier {
  id: string;
  name: string;
  status: SupplierStatus;
  categories: string;
  categoryTag: 'frames' | 'lenses' | 'contact_lenses' | 'accessories';
  phone: string;
  email: string;
  location: string;
  totalPurchases: number;
  outstanding: number;
  brandCode:
    | 'rayban'
    | 'essilor'
    | 'zeiss'
    | 'lenskart'
    | 'vogue'
    | 'acuvue'
    | 'bausch'
    | 'oakley';
}
