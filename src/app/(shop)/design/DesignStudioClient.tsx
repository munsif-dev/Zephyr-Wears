'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleDesignStore } from '@/stores/simpleDesignStore';
import { useCartStore } from '@/stores/cartStore';
import { TShirtPreview } from '@/components/designer/TShirtPreview';
import { ImageUploader } from '@/components/designer/ImageUploader';
import { PlacementSelector } from '@/components/designer/PlacementSelector';
import { DesignControls } from '@/components/designer/DesignControls';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ShoppingCart, Save } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  variants: Array<{
    id: string;
    size: string;
    color: string;
    colorHex?: string | null;
    stock: number;
    priceAdjustment: number;
  }>;
}

interface DesignStudioClientProps {
  product: Product;
}

export function DesignStudioClient({ product }: DesignStudioClientProps) {
  const router = useRouter();
  const {
    imageUrl,
    placement,
    selectedVariant,
    quantity,
    setProductId,
    setSelectedVariant,
    isComplete,
    getTotalPrice,
    clearDesign,
  } = useSimpleDesignStore();

  const { addItem } = useCartStore();

  // Initialize product and select first variant on mount
  useEffect(() => {
    setProductId(product.id);

    if (product.variants.length > 0 && !selectedVariant) {
      const firstVariant = product.variants[0];
      setSelectedVariant({
        id: firstVariant.id,
        size: firstVariant.size,
        color: firstVariant.color,
        colorHex: firstVariant.colorHex || undefined,
        price: product.basePrice + firstVariant.priceAdjustment,
        stock: firstVariant.stock,
      });
    }
  }, [product, setProductId, setSelectedVariant, selectedVariant]);

  const handleAddToCart = async () => {
    if (!isComplete()) {
      toast.error('Please complete your design', {
        description: 'Upload an image and select size, color, and quantity',
      });
      return;
    }

    if (!selectedVariant || !imageUrl) {
      toast.error('Missing design information');
      return;
    }

    try {
      // Add to cart
      addItem({
        id: `custom-${Date.now()}`, // Unique ID for custom design
        productId: product.id,
        variantId: selectedVariant.id,
        name: `${product.name} - Custom Design`,
        price: getTotalPrice(),
        quantity,
        image: imageUrl,
        size: selectedVariant.size,
        color: selectedVariant.color,
        stock: selectedVariant.stock,
        isCustom: true,
        customization: {
          imageUrl,
          placement,
        },
      });

      toast.success('Added to cart!', {
        description: 'Your custom design has been added to your cart',
      });

      // Reset design state
      clearDesign();

      // Navigate to cart
      router.push('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart', {
        description: 'Please try again',
      });
    }
  };

  const handleSaveDesign = async () => {
    if (!isComplete()) {
      toast.error('Please complete your design first');
      return;
    }

    try {
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant?.id,
          imageUrl,
          placement,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save design');
      }

      toast.success('Design saved!', {
        description: 'You can access your saved designs from your account',
      });
    } catch (error) {
      console.error('Error saving design:', error);
      toast.error('Failed to save design', {
        description: 'Please try again',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Design Studio</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Create your custom t-shirt
              </p>
            </div>
            {imageUrl && isComplete() && (
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-lg border border-primary/20">
                <span className="text-xs text-muted-foreground">Total:</span>
                <span className="text-xl font-bold text-primary">
                  Rs. {getTotalPrice().toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left side - Preview (50% width) */}
        <div className="hidden lg:flex w-1/2 border-r bg-muted/30">
          <div className="w-full flex flex-col">
            {/* Preview Header */}
            <div className="px-6 py-4 border-b bg-background">
              <h2 className="text-sm font-semibold">Live Preview</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your design in real-time
              </p>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8 flex items-center justify-center min-h-full">
                <div className="w-full max-w-lg">
                  <TShirtPreview />
                  
                  {imageUrl && (
                    <div className="mt-6 bg-background rounded-lg p-4 border">
                      <p className="text-xs font-medium mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Print Guidelines
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• High-resolution images recommended (300 DPI)</li>
                        <li>• Preview is approximate - colors may vary slightly</li>
                        <li>• Design will be printed exactly as shown</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Controls (50% width) */}
        <div className="w-full lg:w-1/2 overflow-y-auto">
          <div className="p-6 max-w-2xl mx-auto">
            <div className="space-y-5">
              {/* Step 1: Image Upload */}
              <div className="border rounded-lg bg-background">
                <div className="px-4 py-3 border-b bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <h3 className="text-sm font-semibold">Upload Your Design</h3>
                  </div>
                </div>
                <div className="p-4">
                  <ImageUploader />
                </div>
              </div>

              {/* Step 2: Placement Selection */}
              {imageUrl && (
                <div className="border rounded-lg bg-background">
                  <div className="px-4 py-3 border-b bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <h3 className="text-sm font-semibold">Choose Placement</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <PlacementSelector />
                  </div>
                </div>
              )}

              {/* Step 3: Product Customization */}
              {imageUrl && (
                <div className="border rounded-lg bg-background">
                  <div className="px-4 py-3 border-b bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <h3 className="text-sm font-semibold">Select Options</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <DesignControls variants={product.variants} basePrice={product.basePrice} />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {imageUrl && (
                <div className="sticky bottom-0 bg-background border rounded-lg p-4 shadow-lg">
                  {isComplete() && (
                    <div className="flex items-center justify-between mb-3 pb-3 border-b">
                      <span className="text-sm font-medium">Total Price:</span>
                      <span className="text-xl font-bold text-primary">
                        Rs. {getTotalPrice().toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveDesign}
                      variant="outline"
                      className="flex-1"
                      disabled={!isComplete()}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1"
                      size="lg"
                      disabled={!isComplete() || !selectedVariant || selectedVariant.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
