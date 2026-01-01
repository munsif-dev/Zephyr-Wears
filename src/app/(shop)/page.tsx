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

  return products;
}

export default async function HomePage() {
  const [featuredProducts, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-50 via-blue-50 to-background dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-background py-18 md:py-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,transparent,black)] opacity-10" />
        
        <div className="container relative mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge variant="secondary" className="mb-6 px-4 text-sm">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Premium Custom T-Shirts
            </Badge>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Design Your Perfect{' '}
              <span className="relative inline-block mt-2">
                <span className="text-5xl md:text-8xl lg:text-9xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  T-Shirt
                </span>
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 10 Q 50 0, 100 10 T 200 10" stroke="currentColor" strokeWidth="3" fill="none" className="text-cyan-500 dark:text-cyan-400" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Bring your creativity to life with our easy-to-use design tool. 
              Choose from premium fabrics and get fast, reliable shipping.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 h-12 shadow-lg hover:shadow-xl transition-all">
                <Link href="/design">
                  <Palette className="mr-2 h-5 w-5" />
                  Start Designing
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 h-12 hover:bg-muted">
                <Link href="/shop">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Collection
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
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
      <section className="py-20 border-b">
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Choose Zephyr Studio?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge technology with premium materials to deliver the perfect custom t-shirt experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow border-2">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Design Tool</h3>
              <p className="text-muted-foreground leading-relaxed">
                Intuitive drag-and-drop interface. Upload your artwork, add text, and see instant previews
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow border-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-muted-foreground leading-relaxed">
                100% premium cotton fabrics with vibrant, long-lasting prints that won't fade or crack
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow border-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-muted-foreground leading-relaxed">
                Quick production and reliable shipping. Free delivery on orders over $50
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 md:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
                <p className="text-muted-foreground text-lg">
                  Handpicked favorites from our collection
                </p>
              </div>
              <Button asChild variant="outline" size="lg" className="group">
                <Link href="/shop">
                  View All Products
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
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
              <div>
                <Badge variant="secondary" className="mb-3">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Just Launched
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">New Arrivals</h2>
                <p className="text-muted-foreground text-lg">
                  Fresh designs just added to our collection
                </p>
              </div>
              <Button asChild variant="outline" size="lg" className="group">
                <Link href="/shop?sort=newest">
                  Shop New Arrivals
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-cyan-600 to-blue-600 dark:from-cyan-900 dark:to-blue-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] opacity-20" />
        
        <div className="container relative mx-auto px-6 md:px-8 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Bring Your Ideas to Life?
            </h2>
            <p className="text-lg md:text-xl mb-10 opacity-90 leading-relaxed">
              Join thousands of satisfied customers who have designed their perfect custom t-shirt. 
              Start your creative journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 h-12 shadow-xl hover:shadow-2xl transition-all">
                <Link href="/design">
                  <Palette className="mr-2 h-5 w-5" />
                  Start Designing Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 h-12 bg-white/10 hover:bg-white/20 border-white/30 text-white hover:text-white backdrop-blur">
                <Link href="/shop">
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
