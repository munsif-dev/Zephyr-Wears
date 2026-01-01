'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  showImage?: boolean;
}

export function CartItem({ item, showImage = true }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4">
      {/* Product Image */}
      {showImage && (
        <Link
          href={`/products/${item.productSlug}`}
          className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0"
        >
          <Image
            src={item.image}
            alt={item.productName || item.name}
            fill
            className="object-cover"
          />
        </Link>
      )}

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.productSlug}`}
          className="font-medium text-sm line-clamp-1 hover:text-primary transition-colors"
        >
          {item.productName}
        </Link>
        <p className="text-xs text-muted-foreground mt-1">
          {item.size} / {item.color}
        </p>
        <p className="text-sm font-semibold mt-1">
          {formatCurrency(item.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>

        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
