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
    <div className="space-y-5">
      {/* Size Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center justify-between">
          <span>Size</span>
          {selectedVariant && (
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {selectedVariant.size}
            </span>
          )}
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((size) => {
            const isSelected = selectedVariant?.size === size;
            const isAvailable = variants.some((v) => v.size === size && v.stock > 0);

            return (
              <button
                key={size}
                onClick={() => handleSizeSelect(size)}
                disabled={!isAvailable}
                className={`relative h-11 rounded-lg border-2 font-medium text-sm transition-all ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground shadow-md'
                    : isAvailable
                    ? 'border-muted hover:border-primary/50 hover:bg-muted'
                    : 'border-muted/50 opacity-40 cursor-not-allowed'
                }`}
              >
                {size}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-background"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center justify-between">
          <span>Color</span>
          {selectedVariant && (
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {selectedVariant.color}
            </span>
          )}
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {colors.map((color) => {
            const isSelected = selectedVariant?.color === color.name;
            const isAvailable = variants.some((v) => v.color === color.name && v.stock > 0);

            return (
              <button
                key={color.name}
                onClick={() => handleColorSelect(color.name)}
                disabled={!isAvailable}
                className={`relative flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : isAvailable
                    ? 'border-muted hover:border-primary/50 hover:bg-muted/50'
                    : 'border-muted/50 opacity-40 cursor-not-allowed'
                }`}
              >
                {color.hex && (
                  <div
                    className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                )}
                <span className="text-sm font-medium">{color.name}</span>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Info */}
      {selectedVariant && (
        <div className={`text-xs font-medium px-3 py-2 rounded-lg ${
          selectedVariant.stock > 0 
            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
            : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
        }`}>
          {selectedVariant.stock > 0 ? (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
              {selectedVariant.stock} units available
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400"></span>
              Out of stock
            </span>
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
            className="h-10 w-10 rounded-lg"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="flex-1 h-10 flex items-center justify-center bg-muted rounded-lg font-bold text-lg">
            {quantity}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            disabled={!selectedVariant || quantity >= selectedVariant.stock}
            className="h-10 w-10 rounded-lg"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-muted/50 rounded-xl p-4 space-y-2.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Base Price:</span>
          <span className="font-medium">Rs. {(selectedVariant?.price || basePrice).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Customization:</span>
          <span className="font-medium">Rs. {CUSTOMIZATION_FEE.toLocaleString()}</span>
        </div>
        {quantity > 1 && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Quantity:</span>
            <span className="font-medium">× {quantity}</span>
          </div>
        )}
        <div className="pt-2 border-t border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Total:</span>
            <span className="text-xl font-bold text-primary">
              Rs. {getTotalPrice().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
