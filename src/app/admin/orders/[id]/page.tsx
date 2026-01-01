import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Package, User, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { OrderStatusForm } from './OrderStatusForm';

// Disable static generation for this page to ensure fresh data
export const revalidate = 0;

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          id: true,
        }
      },
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
            }
          }
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  return order;
}

export default async function AdminOrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const session = await auth();

  // Check admin role
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  const { id } = await params;
  const order = await getOrderById(id);

  const getPaymentStatusClass = (status: string) => {
    if (status === 'SUCCESS') return 'bg-green-600';
    return '';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{order.orderNumber}</h1>
            <p className="text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">{order.status}</Badge>
            <Badge
              variant={order.paymentStatus === 'SUCCESS' ? 'default' : 'destructive'}
              className={getPaymentStatusClass(order.paymentStatus)}
            >
              {order.paymentStatus}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Customer Information</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{order.user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{order.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer ID:</span>
                <span className="font-mono text-sm">{order.user.id}</span>
              </div>
            </div>
          </Card>

          {/* Order Items */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Order Items</h2>
            </div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    {item.variant.product.images[0] ? (
                      <Image
                        src={item.variant.product.images[0].url}
                        alt={item.variant.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    {item.customDesign && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-xs text-white font-medium">Custom</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.variant.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.variant.size} / {item.variant.color}
                    </p>
                    {item.customDesign && (
                      <p className="text-xs text-primary">
                        Custom Design - {item.customDesign.placement}
                      </p>
                    )}
                    <p className="text-sm mt-1">
                      Quantity: {item.quantity} × {formatCurrency(Number(item.price))}
                    </p>
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
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Shipping Address</h2>
            </div>
            <div className="space-y-1">
              <p className="font-medium">{order.shippingName}</p>
              <p className="text-muted-foreground">{order.shippingAddress}</p>
              <p className="text-muted-foreground">
                {order.shippingCity}, {order.shippingState} {order.shippingZipCode}
              </p>
              <p className="text-muted-foreground">{order.shippingCountry}</p>
              <p className="text-muted-foreground mt-2">
                Phone: {order.shippingPhone}
              </p>
            </div>
          </Card>

          {/* Payment Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Payment Information</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status:</span>
                <Badge
                  variant={order.paymentStatus === 'SUCCESS' ? 'default' : 'destructive'}
                  className={getPaymentStatusClass(order.paymentStatus)}
                >
                  {order.paymentStatus}
                </Badge>
              </div>
              {order.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
              )}
              {order.paymentId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID:</span>
                  <span className="font-mono text-sm">{order.paymentId}</span>
                </div>
              )}
              {order.paymentDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Date:</span>
                  <span className="font-medium">
                    {new Date(order.paymentDate).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
              {order.paymentHash && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hash:</span>
                  <span className="font-mono text-xs truncate max-w-[200px]">
                    {order.paymentHash}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
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
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-primary">
                  {formatCurrency(Number(order.total))}
                </span>
              </div>
            </div>
          </Card>

          {/* Admin Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
          </Card>
        </div>
      </div>
    </div>
  );
}
