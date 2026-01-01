'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

export function CartButton() {
  const { getItemCount, toggleCart } = useCartStore();
  const [itemCount, setItemCount] = useState(0);

  // Hydrate cart count only on client
  useEffect(() => {
    setItemCount(getItemCount());
  }, [getItemCount]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={toggleCart}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );
}
