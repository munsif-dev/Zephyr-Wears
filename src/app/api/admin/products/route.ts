import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  basePrice: z.number().positive('Base price must be positive'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
  featured: z.boolean().default(false),
  images: z.array(
    z.object({
      url: z.string().url(),
      altText: z.string().optional(),
      order: z.number().int(),
    })
  ).min(1, 'At least one image is required'),
  variants: z.array(
    z.object({
      size: z.string(),
      color: z.string(),
      colorHex: z.string().optional(),
      priceAdjustment: z.number().default(0),
      stock: z.number().int().nonnegative(),
    })
  ).min(1, 'At least one variant is required'),
});

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    // Create product with images and variants in a transaction
    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          description: validatedData.description || null,
          basePrice: validatedData.basePrice,
          category: validatedData.category,
          status: validatedData.status,
          featured: validatedData.featured,
        },
      });

      // Create product images
      if (validatedData.images.length > 0) {
        await tx.productImage.createMany({
          data: validatedData.images.map((img) => ({
            productId: newProduct.id,
            url: img.url,
            altText: img.altText || null,
            order: img.order,
          })),
        });
      }

      // Create product variants
      if (validatedData.variants.length > 0) {
        await tx.productVariant.createMany({
          data: validatedData.variants.map((variant) => ({
            productId: newProduct.id,
            size: variant.size,
            color: variant.color,
            colorHex: variant.colorHex || null,
            priceAdjustment: variant.priceAdjustment,
            stock: variant.stock,
          })),
        });
      }

      return newProduct;
    });

    // Fetch complete product with relations
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        variants: true,
      },
    });

    return NextResponse.json({ product: completeProduct }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete product (cascade will delete images and variants)
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
