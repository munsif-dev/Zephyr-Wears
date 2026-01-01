import { auth } from '@/lib/auth';
import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { CartButton } from './CartButton';
import { UserMenu } from './UserMenu';
import { MobileMenuButton } from './MobileMenuButton';

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Zephyr Studio
          </span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <Link href="/shop" className="text-sm font-medium transition-colors hover:text-primary">
            Shop
          </Link>
          <Link href="/design" className="text-sm font-medium transition-colors hover:text-primary">
            Design Your Own
          </Link>
        </nav>

        {/* Right side: Search, Cart, User */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <SearchBar />
          </div>
          <CartButton />
          <UserMenu session={session} />

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <MobileMenuButton />
          </div>
        </div>
      </div>
    </header>
  );
}
