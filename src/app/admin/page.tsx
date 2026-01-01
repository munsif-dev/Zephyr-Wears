import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard | Zephyr',
  description: 'Manage your store',
};

async function getDashboardStats() {
  const [totalProducts, totalOrders, totalRevenue, totalUsers] = await Promise.all([
    prisma.product.count({
      where: {
        status: 'ACTIVE',
      },
    }),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
    }),
    prisma.user.count({
      where: {
        role: 'USER',
      },
    }),
  ]);

  // Get recent orders
  const recentOrdersRaw = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: {
        select: {
          id: true,
        },
      },
    },
  });

  const recentOrders = recentOrdersRaw.map(order => ({
    ...order,
    total: Number(order.total),
  }));

  return {
    totalProducts,
    totalOrders,
    totalRevenue: Number(totalRevenue._sum.total || 0),
    totalUsers,
    recentOrders,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      description: 'Active products',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: 'All time orders',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      description: 'All time revenue',
    },
    {
      label: 'Total Customers',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registered users',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {stats.recentOrders.length > 0 ? (
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-semibold">Order #{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.user.name} ({order.user.email})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(Number(order.total))}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {order.status.toLowerCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No orders yet
          </p>
        )}
      </Card>
    </div>
  );
}
