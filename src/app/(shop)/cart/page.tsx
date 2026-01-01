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
      <div className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some products to your cart to get started
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/shop">Browse Products</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/design">Design Your Own</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
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
                      <div className="relative w-16 h-16">
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
                  <h3 className="font-semibold mb-1 truncate">{item.name}</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
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
                  <p className="font-semibold mt-2">{formatCurrency(item.price)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <p className="font-bold text-sm">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({getItemCount()} {getItemCount() === 1 ? 'item' : 'items'}):
                </span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="font-medium">{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%):</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total:</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>

            <Button
              onClick={() => router.push('/checkout')}
              size="lg"
              className="w-full"
            >
              Proceed to Checkout
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full mt-3"
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
