import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const saveDesignSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  imageUrl: z.string().url(),
  placement: z.enum(['chest', 'back']),
  quantity: z.number().int().positive().optional(),
});

// GET - Fetch user's saved designs
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const designs = await prisma.customDesign.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            basePrice: true,
          },
        },
        variant: {
          select: {
            id: true,
            size: true,
            color: true,
            colorHex: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ designs });
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Save a new design
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = saveDesignSchema.parse(body);

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Verify variant exists if provided
    if (validatedData.variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: validatedData.variantId },
      });

      if (!variant || variant.productId !== validatedData.productId) {
        return NextResponse.json(
          { error: 'Invalid variant' },
          { status: 400 }
        );
      }
    }

    // Create the design
    const design = await prisma.customDesign.create({
      data: {
        userId: session.user.id,
        productId: validatedData.productId,
        variantId: validatedData.variantId,
        imageUrl: validatedData.imageUrl,
        placement: validatedData.placement.toUpperCase(),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            basePrice: true,
          },
        },
        variant: {
          select: {
            id: true,
            size: true,
            color: true,
            colorHex: true,
          },
        },
      },
    });

    return NextResponse.json({ design }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error saving design:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
