import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ConfirmationPageProps {
  params: {
    orderNumber: string;
  };
}

async function getOrder(orderNumber: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: {
      orderNumber,
      userId, // Ensure user can only see their own orders
    },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: {
                  name: true,
                  images: {
                    take: 1,
                    orderBy: {
                      order: 'asc',
                    },
                  },
                },
              },
            },
          },
          customDesign: {
            select: {
              imageUrl: true,
              placement: true,
            },
          },
        },
      },
    },
  });

  return order;
}

export default async function OrderConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const order = await getOrder(params.orderNumber, session.user.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Message */}
      <Card className="p-8 text-center mb-8 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-4">
          Thank you for your order. We've received your purchase and will start
          processing it shortly.
        </p>
        <p className="text-sm text-muted-foreground">
          Order #{order.orderNumber}
        </p>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Status</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  <Badge variant="secondary">{order.status}</Badge>
                </span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Estimated delivery: 5-7 business days
                </span>
              </div>
            </div>

            {/* Payment Status */}
            <Separator className="my-4" />
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Payment Status</h3>
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    order.paymentStatus === 'SUCCESS'
                      ? 'default'
                      : order.paymentStatus === 'PENDING'
                      ? 'secondary'
                      : 'destructive'
                  }
                  className={
                    order.paymentStatus === 'SUCCESS'
                      ? 'bg-green-600 hover:bg-green-700'
                      : ''
                  }
                >
                  {order.paymentStatus}
                </Badge>
                {order.paymentMethod && (
                  <span className="text-sm text-muted-foreground">
                    via {order.paymentMethod}
                  </span>
                )}
              </div>
              {order.paymentDate && (
                <p className="text-xs text-muted-foreground">
                  Paid on {new Date(order.paymentDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </Card>

          {/* Order Items */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {item.variant.product.images[0] ? (
                      <Image
                        src={item.variant.product.images[0].url}
                        alt={item.variant.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-muted-foreground text-xs">
                        No Image
                      </div>
                    )}
                    {item.isCustom && item.customDesign && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-12 h-12">
                          <Image
                            src={item.customDesign.imageUrl}
                            alt="Custom design"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.variant.product.name}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        Size: <span className="font-medium">{item.variant.size}</span>
                      </p>
                      <p>
                        Color: <span className="font-medium">{item.variant.color}</span>
                      </p>
                      {item.isCustom && item.customDesign && (
                        <p>
                          Placement:{' '}
                          <span className="font-medium capitalize">
                            {item.customDesign.placement.toLowerCase()}
                          </span>
                        </p>
                      )}
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.shippingName}</p>
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingCity}, {order.shippingState} {order.shippingZipCode}
              </p>
              <p>{order.shippingCountry}</p>
              <p className="pt-2">Phone: {order.shippingPhone}</p>
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">
                  {formatCurrency(Number(order.subtotal))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="font-medium">
                  {formatCurrency(Number(order.shipping))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax:</span>
                <span className="font-medium">
                  {formatCurrency(Number(order.tax))}
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total:</span>
              <span className="text-primary">
                {formatCurrency(Number(order.total))}
              </span>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/account/orders">View All Orders</Link>
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-md text-xs text-muted-foreground">
              <p className="mb-2">
                A confirmation email has been sent to {session.user.email}
              </p>
              <p>
                You'll receive updates about your order status via email.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
