import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Shirt, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto py-8 md:py-10 px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                <Shirt className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Zephyr
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Premium custom t-shirts designed in Sri Lanka. Quality prints, fast island-wide delivery.
            </p>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>+94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span>hello@zephyr.lk</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wide">Shop</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mens" className="text-muted-foreground hover:text-primary transition-colors">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link href="/shop?category=womens" className="text-muted-foreground hover:text-primary transition-colors">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link href="/design" className="text-muted-foreground hover:text-primary transition-colors">
                  Design Your Own
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wide">Support</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                  Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wide">Company</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} Zephyr. Made with ❤️ in Sri Lanka.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
