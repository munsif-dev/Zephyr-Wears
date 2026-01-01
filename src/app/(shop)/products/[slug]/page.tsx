import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductDetailClient } from './ProductDetailClient';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: {
      slug,
      status: 'ACTIVE',
    },
    include: {
      images: {
        orderBy: {
          order: 'asc',
        },
      },
      variants: {
        orderBy: [
          { size: 'asc' },
          { color: 'asc' },
        ],
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  // Calculate average rating
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
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | Zephyr`,
    description: product.description || `Shop ${product.name} at Zephyr`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  // Transform data for client component
  const productData = {
    id: product.id,
    name: product.name,
    description: product.description,
    basePrice: Number(product.basePrice),
    category: product.category,
    images: product.images.map((img: typeof product.images[number]) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
    })),
    variants: product.variants.map((v: typeof product.variants[number]) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex,
      stock: v.stock,
      priceAdjustment: Number(v.priceAdjustment),
    })),
    reviews: product.reviews.map((r: typeof product.reviews[number]) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      userName: r.user.name || 'Anonymous',
      createdAt: r.createdAt.toISOString(),
    })),
    averageRating: product.averageRating,
    totalReviews: product._count.reviews,
  };

  return <ProductDetailClient product={productData} />;
}
