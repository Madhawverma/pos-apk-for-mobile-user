import { Prescription } from './prescription';

export type CustomerStatus = 'Regular' | 'VIP' | 'New' | 'Due Checkup';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  createdAt: string;
  lastVisit?: string;
  totalOrders: number;
  totalSpent: number;
  status?: CustomerStatus;
  tenure?: string;
  avatarBg?: string;
  avatarColor?: string;
  prescriptions?: Prescription[];
}
