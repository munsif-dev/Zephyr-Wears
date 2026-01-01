import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit, Eye } from 'lucide-react';

export const metadata = {
  title: 'Products Management | Admin',
  description: 'Manage your products',
};

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      images: {
        take: 1,
        orderBy: {
          order: 'asc',
        },
      },
      variants: {
        select: {
          stock: true,
        },
      },
      _count: {
        select: {
          variants: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return products;
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-6">
          {products.map((product) => {
            const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
            const isLowStock = totalStock > 0 && totalStock <= 5;
            const isOutOfStock = totalStock === 0;

            return (
              <Card key={product.id} className="p-6">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="relative w-32 h-32 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-muted-foreground text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description || 'No description'}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/products/${product.slug}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Price</p>
                        <p className="font-semibold">{formatCurrency(Number(product.basePrice))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Category</p>
                        <Badge variant="secondary" className="capitalize">
                          {product.category}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <Badge
                          variant={product.status === 'ACTIVE' ? 'default' : 'secondary'}
                        >
                          {product.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Variants</p>
                        <p className="font-medium">{product._count.variants}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Stock</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{totalStock}</p>
                          {isOutOfStock && (
                            <Badge variant="destructive" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                          {isLowStock && (
                            <Badge variant="secondary" className="text-xs">
                              Low Stock
                            </Badge>
                          )}
                        </div>
                      </div>
                      {product.featured && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Featured</p>
                          <Badge variant="default">Yes</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No products found</p>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Product
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
