import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, Settings } from 'lucide-react';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default async function AccountLayout({ children }: AccountLayoutProps) {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user) {
    redirect('/auth/login?redirect=/account/orders');
  }

  const navItems = [
    {
      label: 'My Orders',
      href: '/account/orders',
      icon: ShoppingBag,
    },
    {
      label: 'Profile',
      href: '/account/profile',
      icon: User,
    },
    {
      label: 'Settings',
      href: '/account/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1">
          <div className="bg-background border rounded-lg p-6 sticky top-4">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">My Account</h2>
              <p className="text-sm text-muted-foreground">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>

            <nav className="space-y-1">
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

            <div className="mt-6 pt-6 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
                asChild
              >
                <Link href="/">
                  Back to Store
                </Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
