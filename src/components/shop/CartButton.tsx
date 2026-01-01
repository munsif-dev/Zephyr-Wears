'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function CartButton() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const [itemCount, setItemCount] = useState(0);

  // Update count whenever items change
  useEffect(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setItemCount(count);
  }, [items]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => router.push('/cart')}
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
