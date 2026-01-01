import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Palette, ShoppingBag, Star, Truck, Shield, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Zephyr Studio - Custom T-Shirt Design & Shop',
  description: 'Design your own custom t-shirt or shop from our collection of premium quality tees. Fast shipping, high-quality materials.',
};

// Revalidate every 60 seconds
export const revalidate = 60;
export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      status: 'ACTIVE',
      featured: true,
    },
    include: {
      images: {
        orderBy: {
          order: 'asc',
        },
        take: 1,
      },
      variants: {
        select: {
          stock: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    take: 8,
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate average rating for each product
  const productsWithRatings = await Promise.all(
    products.map(async (product) => {
      const reviews = await prisma.review.findMany({
        where: { productId: product.id },
        select: { rating: true },
      });

      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      return {
        ...product,
        averageRating,
        basePrice: Number(product.basePrice),
      };
    })
  );

  return productsWithRatings;
}

async function getNewArrivals() {
  const products = await prisma.product.findMany({
    where: {
      status: 'ACTIVE',
      category: {
        not: 'custom',
      },
    },
    include: {
      images: {
        orderBy: {
          order: 'asc',
        },
        take: 1,
      },
      variants: {
        select: {
          stock: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return products.map(product => ({
    ...product,
    basePrice: Number(product.basePrice),
  }));
}

export default async function HomePage() {
  const [featuredProducts, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-50 via-blue-50 to-background dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-background py-12 md:py-16 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,transparent,black)] opacity-10" />
        
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge variant="secondary" className="mb-5 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 mr-1.5" />
              Premium Custom T-Shirts
            </Badge>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 leading-tight">
              Design Your Perfect
              <br />
              <span className="relative inline-block mt-2">
                <span className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  T-Shirt
                </span>
                <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 10 Q 50 0, 100 10 T 200 10" stroke="currentColor" strokeWidth="3" fill="none" className="text-cyan-500 dark:text-cyan-400" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Bring your creativity to life with our easy-to-use design tool. 
              Choose from premium fabrics and get fast, reliable shipping.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="px-8 shadow-lg hover:shadow-xl transition-all">
                <Link href="/design">
                  <Palette className="mr-2 h-4 w-4" />
                  Start Designing
                </Link>
              </Button>
              <Button asChild variant="outline" size="default" className="px-6 hover:bg-muted">
                <Link href="/shop">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Browse Collection
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Secure Checkout</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Free Shipping $50+</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Why Choose Zephyr?</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Premium quality, fast delivery, and exceptional customer service
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-4 text-center hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-semibold mb-1.5">Easy Design Tool</h3>
              <p className="text-xs text-muted-foreground">
                Intuitive drag-and-drop interface. Upload your artwork, add text, and see instant previews
              </p>
            </Card>

            <Card className="p-4 text-center hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Star className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-semibold mb-1.5">Premium Quality</h3>
              <p className="text-xs text-muted-foreground">
                100% premium cotton with vibrant, long-lasting prints
              </p>
            </Card>

            <Card className="p-4 text-center hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-semibold mb-1.5">Fast Delivery</h3>
              <p className="text-xs text-muted-foreground">
                Island-wide delivery in 3-5 days. Free shipping over Rs. 5,000
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">Featured Products</h2>
                <p className="text-sm text-muted-foreground">
                  Handpicked favorites from our collection
                </p>
              </div>
              <Button asChild variant="outline" className="group">
                <Link href="/shop">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3">
              <div>
                <Badge variant="secondary" className="mb-2 text-xs\">\n                  <Sparkles className="h-3 w-3 mr-1" />
                  Just Launched
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">New Arrivals</h2>
                <p className="text-sm text-muted-foreground">
                  Fresh designs just added
                </p>
              </div>
              <Button asChild variant="outline" className="group">
                <Link href="/shop?sort=newest">
                  Shop New
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-cyan-600 to-blue-600 dark:from-cyan-900 dark:to-blue-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] opacity-20" />
        
        <div className="container relative mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Ready to Bring Your Ideas to Life?
            </h2>
            <p className="text-base md:text-lg mb-6 opacity-90">
              Join thousands of satisfied customers. Start your creative journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="default" variant="secondary" className="px-6 shadow-xl hover:shadow-2xl transition-all">
                <Link href="/design">
                  <Palette className="mr-2 h-4 w-4" />
                  Start Designing Now
                </Link>
              </Button>
              <Button asChild size="default" variant="outline" className="px-6 bg-white/10 hover:bg-white/20 border-white/30 text-white hover:text-white backdrop-blur">
                <Link href="/shop">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
