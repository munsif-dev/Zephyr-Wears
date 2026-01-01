import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductFilters } from '@/components/shop/ProductFilters';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal } from 'lucide-react';

export const metadata = {
  title: 'Shop T-Shirts | Zephyr Studio',
  description: 'Browse our collection of premium quality custom t-shirts',
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    price?: string;
    sort?: string;
    search?: string;
  }>;
}

async function getProducts(searchParams: ShopPageProps['searchParams']) {
  const params = await searchParams;
  const { category, price, sort, search } = params;

  // Build where clause
  const where: any = {
    status: 'ACTIVE',
  };

  const andConditions: any[] = [];

  // Category filter
  if (category && category !== 'all') {
    andConditions.push({
      category: category,
    });
  }

  // Price range filter
  if (price && price !== 'all') {
    const priceRanges: Record<string, { min: number; max?: number }> = {
      '0-1000': { min: 0, max: 1000 },
      '1000-2000': { min: 1000, max: 2000 },
      '2000-3000': { min: 2000, max: 3000 },
      '3000+': { min: 3000 },
    };

    const range = priceRanges[price];
    if (range) {
      andConditions.push({
        basePrice: {
          gte: range.min,
          ...(range.max ? { lte: range.max } : {}),
        },
      });
    }
  }

  // Search filter
  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  // Combine all conditions
  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  // Build orderBy clause
  let orderBy: any = { createdAt: 'desc' }; // default: newest first

  if (sort === 'price-asc') {
    orderBy = { basePrice: 'asc' };
  } else if (sort === 'price-desc') {
    orderBy = { basePrice: 'desc' };
  } else if (sort === 'popular') {
    // For now, use createdAt. Can be enhanced with actual popularity metrics later
    orderBy = { createdAt: 'desc' };
  }

  const products = await prisma.product.findMany({
    where,
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
    orderBy,
  });

  // Calculate average rating for each product
  const productsWithRatings = await Promise.all(
    products.map(async (product: any) => {
      const reviews = await prisma.review.findMany({
        where: { productId: product.id },
        select: { rating: true },
      });

      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
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

function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-[4/5] w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

async function ProductsList({ searchParams }: ShopPageProps) {
  const products = await getProducts(searchParams);

  return (
    <ProductGrid
      products={products}
      emptyMessage="No products found matching your criteria. Try adjusting your filters."
    />
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const { search, category, price, sort } = params;
  
  // Get total product count for display
  const products = await getProducts(searchParams);
  const productCount = products.length;

  // Get active filters for display
  const activeFilters = [];
  if (category) activeFilters.push(category.charAt(0).toUpperCase() + category.slice(1));
  if (price) {
    const priceLabel = price.replace('0-1000', 'Under Rs. 1,000')
      .replace('1000-2000', 'Rs. 1,000-2,000')
      .replace('2000-3000', 'Rs. 2,000-3,000')
      .replace('3000+', 'Over Rs. 3,000');
    activeFilters.push(priceLabel);
  }
  if (search) activeFilters.push(`"${search}"`);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4" aria-label="Breadcrumb">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <span>/</span>
            <span className="text-foreground font-medium">Shop</span>
            {category && (
              <>
                <span>/</span>
                <span className="text-foreground font-medium capitalize">{category}</span>
              </>
            )}
          </nav>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : 'All Products'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {search
                  ? `Showing ${productCount} result${productCount !== 1 ? 's' : ''} for "${search}"`
                  : `Discover our collection of ${productCount} premium t-shirt${productCount !== 1 ? 's' : ''}`}
              </p>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
              <SortDropdown />
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
              <span className="text-xs font-medium text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {filter}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <SlidersHorizontal className="h-4 w-4" />
                <h2 className="text-base font-semibold">Filter Products</h2>
              </div>
              <ProductFilters />
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden fixed bottom-6 right-6 z-50">
            <button className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow">
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            <Suspense fallback={<ProductsLoading />}>
              <ProductsList searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
