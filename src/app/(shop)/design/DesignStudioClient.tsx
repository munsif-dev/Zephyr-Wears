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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Design Your Own T-Shirt</h1>
        <p className="text-muted-foreground">
          Upload your design, choose placement, and customize your perfect tee
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left side - Preview */}
        <div className="order-2 lg:order-1">
          <Card className="p-6 sticky top-4">
            <TShirtPreview />
            <Separator className="my-6" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium">Preview Tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>This is a preview of how your design will appear</li>
                <li>Final print quality may vary</li>
                <li>High-resolution images recommended (300 DPI)</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Right side - Controls */}
        <div className="order-1 lg:order-2 space-y-6">
          {/* Image Upload */}
          <Card className="p-6">
            <ImageUploader />
          </Card>

          {/* Placement Selection */}
          {imageUrl && (
            <Card className="p-6">
              <PlacementSelector />
            </Card>
          )}

          {/* Product Customization */}
          {imageUrl && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Customize Your T-Shirt</h3>
              <DesignControls variants={product.variants} basePrice={product.basePrice} />
            </Card>
          )}

          {/* Action Buttons */}
          {imageUrl && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSaveDesign}
                variant="outline"
                className="flex-1"
                disabled={!isComplete()}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Design
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
          )}
        </div>
      </div>
    </div>
  );
}
