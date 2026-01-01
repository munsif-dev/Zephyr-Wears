/**
 * PayHere Payment Gateway Configuration for Sri Lanka
 * Documentation: https://support.payhere.lk/api-&-mobile-sdk/payhere-checkout
 */

import crypto from 'crypto';

export const PAYHERE_CONFIG = {
  merchantId: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID!,
  merchantSecret: process.env.PAYHERE_MERCHANT_SECRET!,
  mode: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  currency: 'LKR',
  sandboxUrl: 'https://sandbox.payhere.lk/pay/checkout',
  liveUrl: 'https://www.payhere.lk/pay/checkout',
};

// Payment method types supported by PayHere
export enum PaymentMethod {
  VISA = 'VISA',
  MASTER = 'MASTER',
  AMEX = 'AMEX',
  eZCash = 'eZCash',
  mCash = 'mCash',
  Genie = 'Genie',
  VISHWA = 'VISHWA',
}

// Payment status from PayHere
export enum PaymentStatus {
  SUCCESS = 2,        // Payment successful
  PENDING = 0,        // Payment pending
  FAILED = -1,        // Payment failed
  CANCELLED = -2,     // Payment cancelled
  CHARGEDBACK = -3,   // Payment charged back
}

// Generate MD5 hash for PayHere security
export function generatePayHereHash(
  merchantId: string,
  orderId: string,
  amount: string,
  currency: string,
  merchantSecret: string
): string {
  const hash = crypto
    .createHash('md5')
    .update(
      merchantId +
      orderId +
      parseFloat(amount).toFixed(2) +
      currency +
      getMd5(merchantSecret)
    )
    .digest('hex')
    .toUpperCase();
  return hash;
}

function getMd5(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex').toUpperCase();
}

// Payment payload interface
export interface PayHerePaymentPayload {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  currency: string;
  amount: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  hash: string;
  // Optional fields
  delivery_address?: string;
  delivery_city?: string;
  delivery_country?: string;
  custom_1?: string; // Can store user ID
  custom_2?: string; // Can store order ID
}
