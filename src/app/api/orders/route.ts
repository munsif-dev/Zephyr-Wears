import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';
import { z } from 'zod';

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
      isCustom: z.boolean().optional(),
      customization: z
        .object({
          imageUrl: z.string().url(),
          placement: z.enum(['chest', 'back']),
        })
        .optional(),
    })
  ),
  shippingAddress: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
    phone: z.string(),
  }),
  subtotal: z.number().positive(),
  shipping: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  total: z.number().positive(),
});

// GET - Fetch user's orders
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ordersRaw = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    name: true,
                    images: {
                      take: 1,
                      orderBy: {
                        order: 'asc',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const orders = ordersRaw.map(order => ({
      ...order,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      shipping: Number(order.shipping),
      total: Number(order.total),
      items: order.items.map(item => ({
        ...item,
        price: Number(item.price),
      })),
    }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Verify all products and variants exist and have sufficient stock
    for (const item of validatedData.items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        return NextResponse.json(
          { error: `Variant ${item.variantId} not found` },
          { status: 404 }
        );
      }

      if (variant.productId !== item.productId) {
        return NextResponse.json(
          { error: `Invalid variant for product ${item.productId}` },
          { status: 400 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${variant.product.name} (${variant.size}/${variant.color})`,
          },
          { status: 400 }
        );
      }
    }

    // Create order and order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          orderNumber,
          status: 'PENDING',
          subtotal: validatedData.subtotal,
          shipping: validatedData.shipping,
          tax: validatedData.tax,
          total: validatedData.total,
          shippingName: validatedData.shippingAddress.name,
          shippingAddress: validatedData.shippingAddress.address,
          shippingCity: validatedData.shippingAddress.city,
          shippingState: validatedData.shippingAddress.state,
          shippingZipCode: validatedData.shippingAddress.zipCode,
          shippingCountry: validatedData.shippingAddress.country,
          shippingPhone: validatedData.shippingAddress.phone,
        },
      });

      // Create order items and update stock
      for (const item of validatedData.items) {
        // Create order item
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            isCustom: item.isCustom || false,
          },
        });

        // Create custom design if applicable
        if (item.isCustom && item.customization) {
          await tx.customDesign.create({
            data: {
              userId: session.user.id,
              productId: item.productId,
              variantId: item.variantId,
              orderItemId: orderItem.id,
              imageUrl: item.customization.imageUrl,
              placement: item.customization.placement.toUpperCase(),
            },
          });
        }

        // Update variant stock
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    // Fetch the complete order with items
    const completeOrderRaw = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    name: true,
                    images: {
                      take: 1,
                      orderBy: {
                        order: 'asc',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const completeOrder = completeOrderRaw ? {
      ...completeOrderRaw,
      subtotal: Number(completeOrderRaw.subtotal),
      tax: Number(completeOrderRaw.tax),
      shipping: Number(completeOrderRaw.shipping),
      total: Number(completeOrderRaw.total),
      items: completeOrderRaw.items.map(item => ({
        ...item,
        price: Number(item.price),
      })),
    } : null;

    return NextResponse.json({ order: completeOrder }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
