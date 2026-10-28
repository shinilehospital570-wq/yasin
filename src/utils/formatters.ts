import { OrderStatus, PaymentMethod, PaymentStatus } from '../types';

/**
 * Format currency amount into Ethiopian Birr standard format: "1,500 Br"
 */
export function formatETB(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 Br';
  }
  // Safe integer rounding for Ethiopian Birr
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString('en-US')} Br`;
}

/**
 * Format dates into friendly Somali / readable date string
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('so-SO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString('so-SO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function getOrderStatusInfo(status: OrderStatus): {
  labelSo: string;
  labelEn: string;
  colorClass: string;
  badgeBg: string;
  stepIndex: number;
} {
  switch (status) {
    case 'dalabka_la_helay':
      return {
        labelSo: 'Dalabka Waa La Helay',
        labelEn: 'Order Received',
        colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
        badgeBg: 'bg-amber-500',
        stepIndex: 1,
      };
    case 'waa_la_xaqiijiyay':
      return {
        labelSo: 'Waa La Xaqiijiyay',
        labelEn: 'Confirmed',
        colorClass: 'text-blue-700 bg-blue-50 border-blue-200',
        badgeBg: 'bg-blue-600',
        stepIndex: 2,
      };
    case 'diyaarinta_alaabta':
      return {
        labelSo: 'Diyaarinta Alaabta',
        labelEn: 'Preparing Order',
        colorClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
        badgeBg: 'bg-indigo-600',
        stepIndex: 3,
      };
    case 'waa_la_soo_diray':
      return {
        labelSo: 'Waa La Soo Diray',
        labelEn: 'Dispatched',
        colorClass: 'text-purple-700 bg-purple-50 border-purple-200',
        badgeBg: 'bg-purple-600',
        stepIndex: 4,
      };
    case 'waa_la_dhiibayaa':
      return {
        labelSo: 'Waa La Dhiibayaa',
        labelEn: 'Out for Delivery',
        colorClass: 'text-cyan-700 bg-cyan-50 border-cyan-200',
        badgeBg: 'bg-cyan-600',
        stepIndex: 5,
      };
    case 'waa_la_gaarsiiyay':
      return {
        labelSo: 'Waa La Gaarsiiyay',
        labelEn: 'Delivered',
        colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        badgeBg: 'bg-emerald-600',
        stepIndex: 6,
      };
    case 'waa_la_joojiyay':
      return {
        labelSo: 'Waa La Joojiyay',
        labelEn: 'Cancelled',
        colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
        badgeBg: 'bg-rose-600',
        stepIndex: -1,
      };
  }
}

export function getPaymentStatusInfo(status: PaymentStatus): {
  labelSo: string;
  labelEn: string;
  colorClass: string;
  isVerified: boolean;
} {
  switch (status) {
    case 'pending':
      return {
        labelSo: 'Lama Bixin',
        labelEn: 'Pending Payment',
        colorClass: 'text-slate-700 bg-slate-100 border-slate-300',
        isVerified: false,
      };
    case 'pending_verification':
      return {
        labelSo: 'Lacagta Weli Lama Xaqiijin',
        labelEn: 'Payment Pending Verification',
        colorClass: 'text-amber-800 bg-amber-50 border-amber-300',
        isVerified: false,
      };
    case 'verified':
      return {
        labelSo: 'Waa La Xaqiijiyay',
        labelEn: 'Verified & Paid',
        colorClass: 'text-emerald-800 bg-emerald-50 border-emerald-300',
        isVerified: true,
      };
    case 'rejected':
      return {
        labelSo: 'Waa La Diiday',
        labelEn: 'Payment Rejected',
        colorClass: 'text-rose-800 bg-rose-50 border-rose-300',
        isVerified: false,
      };
    case 'refunded':
      return {
        labelSo: 'Waa La Celiyay',
        labelEn: 'Refunded',
        colorClass: 'text-purple-800 bg-purple-50 border-purple-300',
        isVerified: false,
      };
  }
}

export function getPaymentMethodName(method: PaymentMethod): {
  nameSo: string;
  shortName: string;
  badgeColor: string;
} {
  switch (method) {
    case 'telebirr':
      return {
        nameSo: 'Telebirr (Ethio Telecom)',
        shortName: 'Telebirr',
        badgeColor: 'bg-emerald-600 text-white',
      };
    case 'ebirr':
      return {
        nameSo: 'E-Birr Mobile Money',
        shortName: 'E-Birr',
        badgeColor: 'bg-amber-600 text-white',
      };
    case 'cbe':
      return {
        nameSo: 'Bankiga Ganacsiga Itoobiya (CBE)',
        shortName: 'CBE Bank',
        badgeColor: 'bg-purple-700 text-white',
      };
    case 'cash_on_delivery':
      return {
        nameSo: 'Lacag-bixinta Markaad Alaabta Hesho (Cash on Delivery)',
        shortName: 'Cash on Delivery',
        badgeColor: 'bg-slate-700 text-white',
      };
  }
}
