import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, LayoutDashboard, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Products',
      href: '/admin/products',
      icon: Package,
    },
    {
      label: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-background border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-1">Zephyr Admin</h1>
          <p className="text-sm text-muted-foreground">{session.user.name}</p>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-3 right-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            asChild
          >
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              Back to Store
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
