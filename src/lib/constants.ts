// T-shirt sizes
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

// T-shirt colors
export const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#008000' },
  { name: 'Yellow', hex: '#FFFF00' },
] as const;

// Fit types
export const FIT_TYPES = ['regular', 'slim', 'oversized'] as const;

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
} as const;

// Payment statuses
export const PAYMENT_STATUSES = {
  PENDING: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
} as const;

// Product sort options
export const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Most Popular', value: 'popular' },
] as const;

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const ORDERS_PER_PAGE = 10;
export const REVIEWS_PER_PAGE = 5;

// Tax rate (example: 8.5%)
export const TAX_RATE = 0.085;

// Shipping cost
export const SHIPPING_COST = 9.99;
export const FREE_SHIPPING_THRESHOLD = 50;

// Customization fee
export const CUSTOMIZATION_FEE = 5.00;

// Design canvas settings
export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 500;
export const MAX_DESIGN_LAYERS = 10;

// Fonts for text design
export const DESIGN_FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Comic Sans MS',
  'Impact',
  'Courier New',
  'Roboto',
  'Open Sans',
] as const;

// Font sizes
export const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72] as const;
