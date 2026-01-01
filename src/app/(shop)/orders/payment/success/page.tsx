'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // PayHere redirects with order_id parameter
    const orderId = searchParams.get('order_id');

    if (orderId) {
      setOrderNumber(orderId);
      setIsVerifying(false);

      // Clear cart
      localStorage.removeItem('cart-storage');
    } else {
      // If no order_id, redirect to home after 3 seconds
      setTimeout(() => router.push('/'), 3000);
    }
  }, [searchParams, router]);

  if (isVerifying) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Verifying payment...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto p-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your order. Your payment has been processed successfully.
        </p>

        {orderNumber && (
          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
            <p className="text-2xl font-bold">{orderNumber}</p>
          </div>
        )}

        <p className="text-sm mb-8">
          You will receive an email confirmation shortly with your order details.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href={`/orders/${orderNumber}/confirmation`}>
              View Order Details
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/shop">
              Continue Shopping
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
