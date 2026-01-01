'use client';

import { useSimpleDesignStore } from '@/stores/simpleDesignStore';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { CUSTOMIZATION_FEE } from '@/lib/constants';

interface DesignControlsProps {
  variants: Array<{
    id: string;
    size: string;
    color: string;
    colorHex?: string | null;
    stock: number;
    priceAdjustment: number;
  }>;
  basePrice: number;
}

export function DesignControls({ variants, basePrice }: DesignControlsProps) {
  const {
    selectedVariant,
    setSelectedVariant,
    quantity,
    incrementQuantity,
    decrementQuantity,
    getTotalPrice,
  } = useSimpleDesignStore();

  // Get unique sizes and colors
  const sizes = [...new Set(variants.map((v) => v.size))];
  const colors = [...new Set(variants.map((v) => v.color))].map((color) => {
    const variant = variants.find((v) => v.color === color);
    return {
      name: color,
      hex: variant?.colorHex || undefined,
    };
  });

  const handleSizeSelect = (size: string) => {
    // Find matching variant with current color or first available color
    const currentColor = selectedVariant?.color;
    let variant = variants.find((v) => v.size === size && v.color === currentColor);

    if (!variant) {
      variant = variants.find((v) => v.size === size);
    }

    if (variant) {
      setSelectedVariant({
        id: variant.id,
        size: variant.size,
        color: variant.color,
        colorHex: variant.colorHex || undefined,
        price: Number(basePrice) + Number(variant.priceAdjustment),
        stock: variant.stock,
      });
    }
  };

  const handleColorSelect = (color: string) => {
    // Find matching variant with current size or first available size
    const currentSize = selectedVariant?.size;
    let variant = variants.find((v) => v.color === color && v.size === currentSize);

    if (!variant) {
      variant = variants.find((v) => v.color === color);
    }

    if (variant) {
      setSelectedVariant({
        id: variant.id,
        size: variant.size,
        color: variant.color,
        colorHex: variant.colorHex || undefined,
        price: Number(basePrice) + Number(variant.priceAdjustment),
        stock: variant.stock,
      });
    }
  };

  const unitPrice = selectedVariant
    ? selectedVariant.price + CUSTOMIZATION_FEE
    : basePrice + CUSTOMIZATION_FEE;

  return (
    <div className="space-y-6">
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
            const isAvailable = variants.some((v) => v.size === size && v.stock > 0);

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
            const isAvailable = variants.some((v) => v.color === color.name && v.stock > 0);

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

      {/* Quantity Selector */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Quantity</Label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            disabled={!selectedVariant || quantity >= selectedVariant.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Price Summary */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Base Price:</span>
          <span>{formatCurrency(selectedVariant?.price || basePrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Customization Fee:</span>
          <span>{formatCurrency(CUSTOMIZATION_FEE)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Unit Price:</span>
          <span className="font-medium">{formatCurrency(unitPrice)}</span>
        </div>
        {quantity > 1 && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Quantity:</span>
            <span>× {quantity}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total:</span>
          <span className="text-primary">{formatCurrency(getTotalPrice())}</span>
        </div>
      </div>
    </div>
  );
}
