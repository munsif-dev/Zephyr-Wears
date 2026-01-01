import { ProductCard } from './ProductCard';
import { Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
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
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 blur-xl opacity-20 rounded-full" />
          <div className="relative bg-muted rounded-full p-6">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-1">No products found</h3>
        <p className="text-xs text-muted-foreground text-center max-w-md">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
