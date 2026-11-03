import { Product } from '../types/product';
import { Customer } from '../types/customer';
import { Prescription } from '../types/prescription';
import { mockProducts } from '../data/mockProducts';

export interface CartItem {
  product: Product;
  quantity: number;
  lensCustomization?: string;
}

export interface CartState {
  items: CartItem[];
  selectedCustomer: Customer | null;
  selectedPrescription: Prescription | null;
  discount: number;
  taxRate: number;
  advancePayment: number;
  expectedDeliveryDate: string;
  notes: string;
  lastGeneratedInvoiceId?: string;
}

// Initial cart state starting completely empty with 0% tax by default
let state: CartState = {
  items: [],
  selectedCustomer: null,
  selectedPrescription: null,
  discount: 0,
  taxRate: 0, // Default GST is 0% unless enabled
  advancePayment: 0,
  expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  notes: '',
  lastGeneratedInvoiceId: undefined,
};

type Listener = (s: CartState) => void;
const listeners = new Set<Listener>();

export const cartManager = {
  getState: () => state,
  subscribe: (fn: Listener) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  addItem: (product: Product, quantity = 1, lensCustomization?: string) => {
    const idx = state.items.findIndex((i) => i.product.id === product.id);
    if (idx > -1) {
      state.items[idx].quantity += quantity;
      if (lensCustomization) state.items[idx].lensCustomization = lensCustomization;
    } else {
      state.items.push({ product, quantity, lensCustomization });
    }
    listeners.forEach((fn) => fn({ ...state }));
  },
  removeItem: (productId: string) => {
    state.items = state.items.filter((i) => i.product.id !== productId);
    listeners.forEach((fn) => fn({ ...state }));
  },
  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      state.items = state.items.filter((i) => i.product.id !== productId);
    } else {
      state.items = state.items.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
    }
    listeners.forEach((fn) => fn({ ...state }));
  },
  setCustomer: (selectedCustomer: Customer | null) => {
    state.selectedCustomer = selectedCustomer;
    listeners.forEach((fn) => fn({ ...state }));
  },
  setPrescription: (selectedPrescription: Prescription | null) => {
    state.selectedPrescription = selectedPrescription;
    listeners.forEach((fn) => fn({ ...state }));
  },
  setTaxRate: (taxRate: number) => {
    state.taxRate = taxRate;
    listeners.forEach((fn) => fn({ ...state }));
  },
  setDiscount: (discount: number) => {
    state.discount = discount;
    listeners.forEach((fn) => fn({ ...state }));
  },
  setAdvancePayment: (advancePayment: number) => {
    state.advancePayment = advancePayment;
    listeners.forEach((fn) => fn({ ...state }));
  },
  setExpectedDeliveryDate: (expectedDeliveryDate: string) => {
    state.expectedDeliveryDate = expectedDeliveryDate;
    listeners.forEach((fn) => fn({ ...state }));
  },
  setNotes: (notes: string) => {
    state.notes = notes;
    listeners.forEach((fn) => fn({ ...state }));
  },
  setLastGeneratedInvoiceId: (id: string) => {
    state.lastGeneratedInvoiceId = id;
    listeners.forEach((fn) => fn({ ...state }));
  },
  clearCart: () => {
    state.items = [];
    state.selectedCustomer = null;
    state.selectedPrescription = null;
    state.discount = 0;
    state.advancePayment = 0;
    state.notes = '';
    state.lastGeneratedInvoiceId = undefined;
    listeners.forEach((fn) => fn({ ...state }));
  },
  getSubtotal: () => {
    return state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },
  getTaxAmount: () => {
    const subtotal = cartManager.getSubtotal();
    const taxable = Math.max(0, subtotal - state.discount);
    return Math.round(taxable * state.taxRate);
  },
  getTotal: () => {
    const subtotal = cartManager.getSubtotal();
    const taxable = Math.max(0, subtotal - state.discount);
    return Math.round(taxable + cartManager.getTaxAmount());
  },
  getBalanceDue: () => {
    return Math.max(0, cartManager.getTotal() - state.advancePayment);
  }
};
