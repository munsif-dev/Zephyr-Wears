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
      '0-20': { min: 0, max: 20 },
      '20-40': { min: 20, max: 40 },
      '40-60': { min: 40, max: 60 },
      '60+': { min: 60 },
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
      };
    })
  );

  return productsWithRatings;
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
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
  if (price) activeFilters.push(`$${price.replace('-', ' - $')}`);
  if (search) activeFilters.push(`"${search}"`);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb & Header Section */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <span>/</span>
            <span className="text-foreground font-medium">Shop</span>
            {category && (
              <>
                <span>/</span>
                <span className="text-foreground font-medium capitalize">{category}</span>
              </>
            )}
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} T-Shirts` : 'All T-Shirts'}
              </h1>
              <p className="text-muted-foreground">
                {search
                  ? `${productCount} result${productCount !== 1 ? 's' : ''} for "${search}"`
                  : `${productCount} product${productCount !== 1 ? 's' : ''} available`}
              </p>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-3">
              <SortDropdown />
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Filters:</span>
              {activeFilters.map((filter, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm">
                  {filter}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center gap-2 mb-4 lg:mb-6">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>
              <ProductFilters />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            <Suspense fallback={<ProductsLoading />}>
              <ProductsList searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
