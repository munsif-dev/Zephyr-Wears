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
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {isOutOfStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge variant="secondary" className="text-xs">
                Low Stock
              </Badge>
            )}
            {product.category === 'custom' && (
              <Badge className="text-xs bg-gradient-to-r from-cyan-600 to-blue-600">
                Custom
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-3">
          {/* Category */}
          <p className="text-xs text-muted-foreground capitalize mb-1.5">
            {product.category.replace('_', ' ')}
          </p>

          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.averageRating !== undefined && product._count?.reviews ? (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.averageRating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium">
                {product.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({product._count.reviews})
              </span>
            </div>
          ) : null}

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-bold">
              {formatCurrency(Number(product.basePrice))}
            </p>
            {!isOutOfStock && totalStock > 0 && (
              <span className="text-xs text-muted-foreground">
                {totalStock} left
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
