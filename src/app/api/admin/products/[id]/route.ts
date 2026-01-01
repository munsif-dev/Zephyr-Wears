import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // Check admin role
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    console.log('Updating product:', id);
    console.log('Request body:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.name || !body.slug || body.basePrice === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, or basePrice' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['DRAFT', 'ACTIVE', 'ARCHIVED'];
    const status = validStatuses.includes(body.status) ? body.status : 'DRAFT';

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update product with transaction
    const product = await prisma.$transaction(async (tx) => {
      // Update product
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          name: body.name,
          slug: body.slug,
          description: body.description,
          basePrice: body.basePrice,
          category: body.category,
          status: status,
          featured: body.featured,
        },
      });

      // Delete existing images and variants
      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      await tx.productVariant.deleteMany({
        where: { productId: id },
      });

      // Create new images
      if (body.images && body.images.length > 0) {
        await tx.productImage.createMany({
          data: body.images.map((img: any, index: number) => ({
            productId: id,
            url: img.url,
            altText: img.altText || null,
            order: index,
          })),
        });
      }

      // Create new variants
      if (body.variants && body.variants.length > 0) {
        await tx.productVariant.createMany({
          data: body.variants.map((variant: any) => ({
            productId: id,
            size: variant.size,
            color: variant.color,
            colorHex: variant.colorHex || null,
            priceAdjustment: variant.priceAdjustment || 0,
            stock: variant.stock || 0,
          })),
        });
      }

      return updatedProduct;
    });

    // Revalidate pages
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath('/shop');
    revalidatePath(`/products/${product.slug}`);

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Product update error:', error);
    
    // Return detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json(
      { error: errorMessage, details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // Check admin role
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete product (cascade will delete images and variants)
    await prisma.product.delete({
      where: { id },
    });

    // Revalidate pages
    revalidatePath('/admin/products');
    revalidatePath('/shop');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
