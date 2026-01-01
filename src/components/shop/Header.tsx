import { auth } from '@/lib/auth';
import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { CartButton } from './CartButton';
import { UserMenu } from './UserMenu';
import { MobileMenuButton } from './MobileMenuButton';
import { Shirt } from 'lucide-react';

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600">
              <Shirt className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Zephyr
              </span>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Sri Lanka</p>
            </div>
            <span className="sm:hidden text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Zephyr
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
            <Link 
              href="/shop" 
              className="px-3 py-1.5 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              Shop
            </Link>
            <Link 
              href="/design" 
              className="px-3 py-1.5 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground"
            >
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
            <div className="lg:hidden">
              <MobileMenuButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
