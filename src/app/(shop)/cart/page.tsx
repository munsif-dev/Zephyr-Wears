'use client';

import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { TAX_RATE, SHIPPING_COST } from '@/lib/constants';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();

  const subtotal = getTotal();
  const shipping = subtotal > 0 ? SHIPPING_COST : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-8 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-3 text-muted-foreground" />
          <h1 className="text-xl font-bold mb-1">Your cart is empty</h1>
          <p className="text-xs text-muted-foreground mb-4">
            Add some products to your cart to get started
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild size="sm">
              <Link href="/shop">Browse Products</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/design">Design Your Own</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-5">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="p-3">
              <div className="flex gap-3">
                {/* Product Image */}
                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-muted-foreground text-xs">
                      No Image
                    </div>
                  )}
                  {item.isCustom && item.customization?.imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-14 h-14">
                        <Image
                          src={item.customization.imageUrl}
                          alt="Custom design"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-0.5 truncate">{item.name}</h3>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>
                      Size: <span className="font-medium">{item.size}</span>
                    </p>
                    <p>
                      Color: <span className="font-medium">{item.color}</span>
                    </p>
                    {item.isCustom && item.customization && (
                      <p>
                        Placement:{' '}
                        <span className="font-medium capitalize">
                          {item.customization.placement}
                        </span>
                      </p>
                    )}
                  </div>
                  <p className="font-semibold text-sm mt-1.5">{formatCurrency(item.price)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive h-7 w-7"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <p className="font-bold text-xs">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-20">
            <h2 className="text-base font-bold mb-3">Order Summary</h2>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Subtotal ({getItemCount()} {getItemCount() === 1 ? 'item' : 'items'}):
                </span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="font-medium">{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Tax (8%):</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="flex justify-between font-bold text-base mb-4">
              <span>Total:</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>

            <Button
              onClick={() => router.push('/checkout')}
              className="w-full"
            >
              Proceed to Checkout
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full mt-2"
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
