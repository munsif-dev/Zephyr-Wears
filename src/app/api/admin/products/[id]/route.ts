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

      // Get existing variants to identify which ones are referenced by orders
      const existingVariants = await tx.productVariant.findMany({
        where: { productId: id },
        include: {
          orderItems: {
            select: { id: true }
          }
        }
      });

      // Separate variants into those with and without order references
      const variantsWithOrders = existingVariants.filter(v => v.orderItems.length > 0);
      const variantsWithoutOrders = existingVariants.filter(v => v.orderItems.length === 0);

      // Delete only images (safe to delete)
      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      // Delete only variants that are NOT referenced by orders
      if (variantsWithoutOrders.length > 0) {
        await tx.productVariant.deleteMany({
          where: { 
            id: { in: variantsWithoutOrders.map(v => v.id) }
          },
        });
      }

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

      // Create new variants or update existing ones
      if (body.variants && body.variants.length > 0) {
        for (const variant of body.variants) {
          // Check if this variant matches an existing one that still exists (wasn't deleted)
          // Only check against variants that have orders (these weren't deleted)
          const existing = variantsWithOrders.find(
            v => v.size === variant.size && v.color === variant.color
          );

          if (existing) {
            // Update existing variant (this variant has orders, so it wasn't deleted)
            await tx.productVariant.update({
              where: { id: existing.id },
              data: {
                colorHex: variant.colorHex || null,
                priceAdjustment: variant.priceAdjustment || 0,
                stock: variant.stock || 0,
              }
            });
          } else {
            // Create new variant
            await tx.productVariant.create({
              data: {
                productId: id,
                size: variant.size,
                color: variant.color,
                colorHex: variant.colorHex || null,
                priceAdjustment: variant.priceAdjustment || 0,
                stock: variant.stock || 0,
              }
            });
          }
        }
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
