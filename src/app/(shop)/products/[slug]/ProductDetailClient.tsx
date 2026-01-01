'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, Star, Minus, Plus } from 'lucide-react';

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex?: string | null;
  stock: number;
  priceAdjustment: number;
}

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
}

interface ProductReview {
  id: string;
  rating: number;
  comment: string | null;
  userName: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  category: string;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: ProductReview[];
  averageRating: number;
  totalReviews: number;
}

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCartStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.find((v) => v.stock > 0) || null
  );
  const [quantity, setQuantity] = useState(1);

  // Get unique sizes and colors
  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [...new Set(product.variants.map((v) => v.color))].map((color) => {
    const variant = product.variants.find((v) => v.color === color);
    return {
      name: color,
      hex: variant?.colorHex || undefined,
    };
  });

  const handleSizeSelect = (size: string) => {
    const currentColor = selectedVariant?.color;
    let variant = product.variants.find((v) => v.size === size && v.color === currentColor);

    if (!variant) {
      variant = product.variants.find((v) => v.size === size);
    }

    if (variant) {
      setSelectedVariant(variant);
      setQuantity(1);
    }
  };

  const handleColorSelect = (color: string) => {
    const currentSize = selectedVariant?.size;
    let variant = product.variants.find((v) => v.color === color && v.size === currentSize);

    if (!variant) {
      variant = product.variants.find((v) => v.color === color);
    }

    if (variant) {
      setSelectedVariant(variant);
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a size and color');
      return;
    }

    if (selectedVariant.stock === 0) {
      toast.error('This variant is out of stock');
      return;
    }

    const finalPrice = product.basePrice + selectedVariant.priceAdjustment;

    addItem({
      id: selectedVariant.id,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price: finalPrice,
      quantity,
      image: product.images[0]?.url || '',
      size: selectedVariant.size,
      color: selectedVariant.color,
      isCustom: false,
    });

    toast.success('Added to cart!', {
      description: `${product.name} (${quantity}x) added to your cart`,
    });
  };

  const currentPrice = selectedVariant
    ? product.basePrice + selectedVariant.priceAdjustment
    : product.basePrice;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].altText || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                No Image
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-primary'
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2 capitalize">{product.category}</Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            {/* Rating */}
            {product.totalReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(product.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.averageRating.toFixed(1)} ({product.totalReviews}{' '}
                  {product.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            <p className="text-3xl font-bold text-primary">{formatCurrency(currentPrice)}</p>
          </div>

          {product.description && (
            <div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          <Separator />

          {/* Size Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Select Size
              {selectedVariant && (
                <span className="ml-2 font-normal text-muted-foreground">
                  ({selectedVariant.size})
                </span>
              )}
            </Label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const isSelected = selectedVariant?.size === size;
                const isAvailable = product.variants.some((v) => v.size === size && v.stock > 0);

                return (
                  <Button
                    key={size}
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => handleSizeSelect(size)}
                    disabled={!isAvailable}
                    className="min-w-[60px]"
                  >
                    {size}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Select Color
              {selectedVariant && (
                <span className="ml-2 font-normal text-muted-foreground">
                  ({selectedVariant.color})
                </span>
              )}
            </Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => {
                const isSelected = selectedVariant?.color === color.name;
                const isAvailable = product.variants.some(
                  (v) => v.color === color.name && v.stock > 0
                );

                return (
                  <button
                    key={color.name}
                    onClick={() => handleColorSelect(color.name)}
                    disabled={!isAvailable}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-muted hover:border-muted-foreground'
                    } ${!isAvailable && 'opacity-50 cursor-not-allowed'}`}
                  >
                    {color.hex && (
                      <div
                        className="w-5 h-5 rounded-full border"
                        style={{ backgroundColor: color.hex }}
                      />
                    )}
                    <span className="text-sm">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Info */}
          {selectedVariant && (
            <div className="text-sm">
              {selectedVariant.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  {selectedVariant.stock} in stock
                </span>
              ) : (
                <span className="text-red-600 font-medium">Out of stock</span>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setQuantity(
                    Math.min(selectedVariant?.stock || 1, quantity + 1)
                  )
                }
                disabled={!selectedVariant || quantity >= selectedVariant.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            size="lg"
            className="w-full"
            disabled={!selectedVariant || selectedVariant.stock === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{review.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
