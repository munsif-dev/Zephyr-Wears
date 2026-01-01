import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: {
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
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.variants.every((v) => v.stock === 0);
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const isLowStock = totalStock > 0 && totalStock <= 5;
  const primaryImage = product.images[0];

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 h-full">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground text-xs">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-1 left-1 flex flex-col gap-0.5">
            {isOutOfStock && (
              <Badge variant="destructive" className="text-[8px] px-1 py-0.5">
                Out of Stock
              </Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge variant="secondary" className="text-[8px] px-1 py-0.5">
                Low Stock
              </Badge>
            )}
            {product.category === 'custom' && (
              <Badge className="text-[8px] px-1 py-0.5 bg-gradient-to-r from-cyan-600 to-blue-600">
                Custom
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-2">
          {/* Category */}
          <p className="text-[9px] text-muted-foreground capitalize mb-0.5">
            {product.category.replace('_', ' ')}
          </p>

          <h3 className="font-semibold text-[11px] mb-0.5 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.averageRating !== undefined && product._count?.reviews ? (
            <div className="flex items-center gap-1 mb-0.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-2 w-2 ${
                      i < Math.floor(product.averageRating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[8px] font-medium">
                {product.averageRating.toFixed(1)}
              </span>
              <span className="text-[8px] text-muted-foreground">
                ({product._count.reviews})
              </span>
            </div>
          ) : null}

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-bold">
              {formatCurrency(Number(product.basePrice))}
            </p>
            {!isOutOfStock && totalStock > 0 && (
              <span className="text-[8px] text-muted-foreground">
                {totalStock} left
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
