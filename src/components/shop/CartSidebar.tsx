'use client';

import { useCartStore } from '@/stores/cartStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CartItem } from './CartItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';

export function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    getSubtotal,
    getTax,
    getShipping,
    getTotal,
  } = useCartStore();

  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = getShipping();
  const total = getTotal();

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button onClick={closeCart} asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">FREE</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && subtotal < 50 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatCurrency(50 - subtotal)} more for free shipping
                </p>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <Button asChild className="w-full mt-4" size="lg">
                <Link href="/cart" onClick={closeCart}>
                  View Cart
                </Link>
              </Button>
              <Button asChild className="w-full" size="lg" variant="outline">
                <Link href="/checkout" onClick={closeCart}>
                  Checkout
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
