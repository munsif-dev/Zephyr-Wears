import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { DesignStudioClient } from './DesignStudioClient';

export const metadata = {
  title: 'Design Your Own T-Shirt | Zephyr',
  description: 'Create a custom t-shirt with your own design',
};

async function getBaseProduct() {
  // Get the first active product marked as customizable
  const product = await prisma.product.findFirst({
    where: {
      status: 'ACTIVE',
      category: 'custom',
    },
    include: {
      variants: {
        where: {
          stock: {
            gt: 0,
          },
        },
        orderBy: {
          size: 'asc',
        },
      },
      images: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  if (!product) {
    // If no custom product exists, get any t-shirt product
    const fallbackProduct = await prisma.product.findFirst({
      where: {
        status: 'ACTIVE',
        category: {
          in: ['mens', 'womens'],
        },
      },
      include: {
        variants: {
          where: {
            stock: {
              gt: 0,
            },
          },
          orderBy: {
            size: 'asc',
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return fallbackProduct;
  }

  return product;
}

export default async function DesignStudioPage() {
  const product = await getBaseProduct();

  if (!product || product.variants.length === 0) {
    notFound();
  }

  // Transform data for client component
  const productData = {
    id: product.id,
    name: product.name,
    description: product.description,
    basePrice: Number(product.basePrice),
    variants: product.variants.map((v: typeof product.variants[number]) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex,
      stock: v.stock,
      priceAdjustment: Number(v.priceAdjustment),
    })),
  };

  return <DesignStudioClient product={productData} />;
}
