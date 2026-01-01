import { ProductCard } from './ProductCard';
import { Package } from 'lucide-react';
import { Prisma } from '@prisma/client';

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number | Prisma.Decimal;
  category: string;
  images: Array<{
    url: string;
    altText: string | null;
  }>;
  variants: Array<{
    stock: number;
  }>;
  _count?: {
    reviews: number;
  };
  averageRating?: number;
}

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = 'No products found'
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 blur-2xl opacity-20 rounded-full" />
          <div className="relative bg-muted rounded-full p-8">
            <Package className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
