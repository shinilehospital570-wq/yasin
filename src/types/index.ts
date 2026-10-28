export type CategoryId = 
  | 'dharka'
  | 'kabaha'
  | 'elektaroonig'
  | 'agabka-guriga'
  | 'quruxda'
  | 'alaabo-kale';

export interface Category {
  id: CategoryId;
  nameSo: string;
  nameEn: string;
  iconName: string;
  descriptionSo: string;
}

export interface Product {
  id: string;
  nameSo: string;
  nameEn?: string;
  descriptionSo: string;
  categoryId: CategoryId;
  price: number; // in ETB
  discountPrice?: number; // in ETB
  stock: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  imageUrl: string;
  additionalImages?: string[];
  unit?: string; // e.g. "xabbo", "joog", "dhalo"
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 
  | 'dalabka_la_helay'       // Order Received
  | 'waa_la_xaqiijiyay'      // Confirmed
  | 'diyaarinta_alaabta'     // Preparing Order
  | 'waa_la_soo_diray'       // Dispatched
  | 'waa_la_dhiibayaa'       // Out for Delivery
  | 'waa_la_gaarsiiyay'      // Delivered
  | 'waa_la_joojiyay';       // Cancelled

export type PaymentMethod = 
  | 'telebirr'
  | 'ebirr'
  | 'cbe'
  | 'cash_on_delivery';

export type PaymentStatus = 
  | 'pending'               // Lacagta lama bixin
  | 'pending_verification'  // Weli lama xaqiijin (Reference submitted)
  | 'verified'              // Waa la xaqiijiyay (Paid)
  | 'rejected'              // Waa la diiday
  | 'refunded';             // Waa la celiyay

export interface EthiopianAddress {
  fullName: string;
  phone: string;
  altPhone?: string;
  region: string;           // e.g. Somali Region, Addis Ababa, Dire Dawa, Harari, Oromia
  cityOrTown: string;       // e.g. Shinile, Dire Dawa, Jigjiga, Addis Ababa, Harar
  kebele?: string;
  streetOrHouse?: string;
  landmark: string;         // e.g. U dhow Cisbitaalka Shinile, Masaajidka, etc.
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;        // in ETB
  totalPrice: number;       // in ETB
  imageUrl?: string;
}

export interface Order {
  id: string;               // e.g. FUAD-2026-1042
  receiptNumber: string;    // e.g. RCP-89410
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;         // in ETB
  deliveryFee: number;      // in ETB
  discountAmount: number;   // in ETB
  total: number;            // in ETB (authoritative calculated)
  deliveryAddress: EthiopianAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  paymentProofUrl?: string; // base64 or storage url
  orderStatus: OrderStatus;
  courierName?: string;
  courierPhone?: string;
  estimatedDeliveryDays?: string;
  cancellationReason?: string;
  paymentAuditLog?: {
    timestamp: string;
    action: string;
    by: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses?: EthiopianAddress[];
  createdAt: string;
}

export interface DeliveryZone {
  id: string;
  nameSo: string;
  region: string;
  city: string;
  fee: number; // in ETB
  estimatedTime: string; // e.g. "1-2 Maalmood"
  isFreeEligible: boolean;
  minOrderForFreeDelivery?: number;
  isActive: boolean;
}

export interface PaymentAccountConfig {
  telebirr: {
    enabled: boolean;
    merchantName: string;
    accountNumber: string;
    instructionsSo: string;
    qrCodeUrl?: string;
  };
  ebirr: {
    enabled: boolean;
    merchantName: string;
    accountNumber: string;
    instructionsSo: string;
    qrCodeUrl?: string;
  };
  cbe: {
    enabled: boolean;
    bankName: string;
    accountName: string;
    accountNumber: string;
    instructionsSo: string;
    qrCodeUrl?: string;
  };
  cashOnDelivery: {
    enabled: boolean;
    instructionsSo: string;
    maxOrderAmount?: number;
  };
}

export interface StoreSettings {
  storeName: string;
  locationName: string;
  locationFull: string;
  contactPhone: string;
  whatsappNumber: string;
  contactEmail: string;
  currencyCode: 'ETB';
  currencySymbol: 'Br';
  headerAnnouncement: string;
  heroTagline: string;
  heroSubheadline: string;
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  allowGuestBrowsing: boolean;
  termsContent: string;
  privacyContent: string;
  aboutContent: string;
}
