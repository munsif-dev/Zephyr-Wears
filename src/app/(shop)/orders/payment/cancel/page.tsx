'use client';

import { XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto p-8 text-center">
        <XCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-8">
          You have cancelled the payment. Your order has not been processed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/cart">
              Return to Cart
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
