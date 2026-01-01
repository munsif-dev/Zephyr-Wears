import { Product, ProductVariant, Order, Review, User } from '@prisma/client';

// Product with relations
export type ProductWithRelations = Product & {
  images: { id: string; url: string; alt: string | null }[];
  variants: ProductVariant[];
  reviews?: Review[];
};

// Cart item type
export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string; // Product name
  productName?: string; // Alternative field name
  productSlug?: string;
  size: string;
  color: string;
  colorHex?: string;
  price: number;
  quantity: number;
  image: string;
  designId?: string;
  stock: number;
  isCustom?: boolean;
  customization?: {
    imageUrl?: string;
    placement?: string;
  };
}

// Design layer type
export interface DesignLayerType {
  id: string;
  type: 'TEXT' | 'IMAGE' | 'SHAPE';
  order: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  data: {
    // For TEXT
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    fontWeight?: string;
    textAlign?: string;

    // For IMAGE
    url?: string;

    // For SHAPE
    shape?: 'rectangle' | 'circle' | 'triangle';
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  };
}

// Order with relations
export type OrderWithRelations = Order & {
  items: Array<{
    id: string;
    productName: string;
    variantSku: string;
    variantSize: string;
    variantColor: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  shippingAddress: {
    fullName: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
};

// Filter params for products
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
  search?: string;
}

// Review with user
export type ReviewWithUser = Review & {
  user: Pick<User, 'id' | 'name' | 'image'>;
};
