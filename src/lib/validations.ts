import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Product schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  basePrice: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
});

// Address schema
export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  line1: z.string().min(5, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  country: z.string().default('US'),
  phone: z.string().min(10, 'Phone number is required'),
});

// Review schema
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters').optional(),
});

// Design schema
export const designSchema = z.object({
  name: z.string().min(1, 'Design name is required'),
  productId: z.string().min(1, 'Product ID is required'),
  config: z.any(), // JSON object
});

// Checkout schema
export const checkoutSchema = z.object({
  shippingAddressId: z.string().optional(),
  newAddress: addressSchema.optional(),
  paymentMethod: z.string().default('stripe'),
}).refine((data) => data.shippingAddressId || data.newAddress, {
  message: 'Either select an existing address or provide a new one',
  path: ['shippingAddressId'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type DesignInput = z.infer<typeof designSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
