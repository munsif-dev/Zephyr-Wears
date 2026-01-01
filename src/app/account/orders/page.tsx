import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Package, ShoppingBag } from 'lucide-react';

// Disable static generation for this page to ensure fresh data
export const revalidate = 0;

async function getUserOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: { name: true, images: true }
              }
            }
          },
          customDesign: {
            select: { imageUrl: true, placement: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login?redirect=/account/orders');
  }

  const orders = await getUserOrders(session.user.id);

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      PENDING: 'secondary',
      PROCESSING: 'default',
      SHIPPED: 'default',
      DELIVERED: 'default',
      CANCELLED: 'destructive',
    };
    return variants[status] || 'secondary';
  };

  const getPaymentStatusClass = (status: string) => {
    if (status === 'SUCCESS') return 'bg-green-600';
    if (status === 'FAILED' || status === 'CANCELLED') return '';
    return '';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          View and track your order history
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            Start shopping to see your orders here
          </p>
          <Button asChild>
            <Link href="/shop">Browse Products</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link
                    href={`/orders/${order.orderNumber}/confirmation`}
                    className="text-lg font-semibold hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex gap-2 mb-4">
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
                <Badge
                  variant={order.paymentStatus === 'SUCCESS' ? 'default' : 'destructive'}
                  className={getPaymentStatusClass(order.paymentStatus)}
                >
                  {order.paymentStatus}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items:</span>
                  <span className="font-medium">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(Number(order.total))}
                  </span>
                </div>
              </div>

              <Button asChild className="w-full" variant="outline">
                <Link href={`/orders/${order.orderNumber}/confirmation`}>
                  View Details
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
