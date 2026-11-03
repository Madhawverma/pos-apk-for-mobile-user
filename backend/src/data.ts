import { Product, Customer, Order } from './types';

export let products: Product[] = [
  {
    id: 'prod-1',
    name: 'Ray-Ban Wayfarer Classic',
    code: 'RB-2140',
    category: 'Sunglasses',
    brand: 'Ray-Ban',
    frameType: 'Full Rim',
    material: 'Acetate',
    price: 6490,
    costPrice: 4200,
    stock: 14,
    minStockAlert: 5,
    barcode: '805289126577',
    description: 'Iconic Wayfarer style frame with dark green classic lenses'
  },
  {
    id: 'prod-2',
    name: 'Titan Titanium Lite Air',
    code: 'TT-7042',
    category: 'Frames',
    brand: 'Titan Eye+',
    frameType: 'Rimless',
    material: 'Titanium',
    price: 3899,
    costPrice: 2200,
    stock: 8,
    minStockAlert: 3,
    barcode: '890781294101',
    description: 'Ultra-lightweight aerospace grade titanium flexible temples'
  },
  {
    id: 'prod-3',
    name: 'Crizal Blue UV Capture 1.56',
    code: 'ES-CRZ-156',
    category: 'Prescription Lenses',
    brand: 'Essilor',
    price: 2400,
    costPrice: 1300,
    stock: 35,
    minStockAlert: 10,
    barcode: '360697011928',
    description: 'Anti-reflective blue cut lenses for screen & digital eye strain protection'
  },
  {
    id: 'prod-4',
    name: 'Fastrack Sporty Wrap Square',
    code: 'FT-M108',
    category: 'Sunglasses',
    brand: 'Fastrack',
    frameType: 'Full Rim',
    material: 'TR90',
    price: 1999,
    costPrice: 950,
    stock: 22,
    minStockAlert: 6,
    barcode: '890772210452',
    description: 'UV400 polarized sporty sunglasses with durable matte black frame'
  },
  {
    id: 'prod-5',
    name: 'Bausch + Lomb PureVision 2 HD',
    code: 'BL-PV2-6P',
    category: 'Contact Lenses',
    brand: 'Bausch + Lomb',
    price: 1450,
    costPrice: 850,
    stock: 18,
    minStockAlert: 5,
    barcode: '785810992312',
    description: 'Monthly disposable high-definition silicone hydrogel contact lenses (pack of 6)'
  }
];

export let customers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rahul Sharma',
    phone: '9826012345',
    email: 'rahul.sharma@example.com',
    city: 'Sehore',
    address: 'Station Road, Sehore',
    createdAt: new Date().toISOString(),
    totalPurchases: 8890
  },
  {
    id: 'cust-2',
    name: 'Priya Verma',
    phone: '9826198765',
    email: 'priya.verma@example.com',
    city: 'Sehore',
    address: 'Bhopal Naka, Sehore',
    createdAt: new Date().toISOString(),
    totalPurchases: 3899
  }
];

export let orders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'SGO-2026-1001',
    customer: {
      id: 'cust-1',
      name: 'Rahul Sharma',
      phone: '9826012345'
    },
    items: [
      {
        product: products[0],
        quantity: 1,
        price: 6490
      },
      {
        product: products[2],
        quantity: 1,
        price: 2400,
        lensCustomization: 'Anti-Glare + Blue Coat'
      }
    ],
    subtotal: 8890,
    discount: 500,
    tax: 0,
    total: 8390,
    advancePaid: 3000,
    balanceDue: 5390,
    orderStatus: 'Fitting in Lab',
    paymentStatus: 'Partial (Advance)',
    paymentMethod: 'UPI/QR',
    expectedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    notes: 'Urgent delivery needed by Sunday evening'
  }
];

