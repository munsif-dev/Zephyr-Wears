'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-4 mt-6">
          <Link
            href="/shop"
            onClick={() => setOpen(false)}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Shop
          </Link>
          <Link
            href="/custom-design"
            onClick={() => setOpen(false)}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Design Your Own
          </Link>
          <Link
            href="/collections"
            onClick={() => setOpen(false)}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Collections
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
