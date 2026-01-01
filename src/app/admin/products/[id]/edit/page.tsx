import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata = {
  title: 'Edit Product | Admin',
  description: 'Edit product details',
};

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  return product;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  const { id } = await params;
  const product = await getProduct(id);

  // Serialize Decimal values for Client Component
  const serializedProduct = {
    ...product,
    basePrice: Number(product.basePrice),
    variants: product.variants.map(v => ({
      ...v,
      priceAdjustment: Number(v.priceAdjustment),
    })),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Product</h1>
        <p className="text-muted-foreground">
          Update product details, variants, and images
        </p>
      </div>

      <ProductForm product={serializedProduct} />
    </div>
  );
}
