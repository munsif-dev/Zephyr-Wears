import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { unstable_cache } from 'next/cache';

export const metadata = {
  title: 'Orders Management | Admin',
  description: 'Manage customer orders',
};

// Disable static generation for this page to ensure fresh data
export const revalidate = 0;

async function getOrders() {
  const ordersRaw = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return ordersRaw.map(order => ({
    ...order,
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    shipping: Number(order.shipping),
    total: Number(order.total),
    items: order.items.map(item => ({
      ...item,
      price: Number(item.price),
      variant: {
        ...item.variant,
        priceAdjustment: Number(item.variant.priceAdjustment),
      },
    })),
  }));
}

const statusColors: Record<string, 'default' | 'secondary' | 'destructive'> = {
  PENDING: 'secondary',
  PROCESSING: 'default',
  SHIPPED: 'default',
  DELIVERED: 'default',
  CANCELLED: 'destructive',
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track customer orders
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      Order #{order.orderNumber}
                    </h3>
                    <Badge variant={statusColors[order.status] || 'secondary'}>
                      {order.status}
                    </Badge>
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
                          ? 'bg-green-600'
                          : ''
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {order.user.name} ({order.user.email})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold mb-2">
                    {formatCurrency(Number(order.total))}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      ITEMS ({order.items.length})
                    </p>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <p key={item.id} className="text-sm">
                          {item.quantity}x {item.variant.product.name} ({item.variant.size}/
                          {item.variant.color})
                          {item.isCustom && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Custom
                            </Badge>
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      SHIPPING ADDRESS
                    </p>
                    <div className="text-sm space-y-0.5">
                      <p>{order.shippingName}</p>
                      <p>{order.shippingAddress}</p>
                      <p>
                        {order.shippingCity}, {order.shippingState}{' '}
                        {order.shippingZipCode}
                      </p>
                      <p>{order.shippingCountry}</p>
                      <p className="text-muted-foreground">{order.shippingPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Subtotal</p>
                    <p className="font-medium">
                      {formatCurrency(Number(order.subtotal))}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Shipping</p>
                    <p className="font-medium">
                      {formatCurrency(Number(order.shipping))}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Tax</p>
                    <p className="font-medium">
                      {formatCurrency(Number(order.tax))}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Total</p>
                    <p className="font-bold">
                      {formatCurrency(Number(order.total))}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No orders found</p>
        </Card>
      )}
    </div>
  );
}
