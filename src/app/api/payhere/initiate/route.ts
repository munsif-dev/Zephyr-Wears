import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePayHereHash, PAYHERE_CONFIG, PayHerePaymentPayload } from '@/lib/payhere';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await req.json();

    // Fetch order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prepare item description
    const itemsDescription = order.items
      .map((item) => `${item.variant.product.name} (${item.quantity}x)`)
      .join(', ');

    // Generate PayHere hash
    const hash = generatePayHereHash(
      PAYHERE_CONFIG.merchantId,
      order.orderNumber,
      order.total.toString(),
      PAYHERE_CONFIG.currency,
      PAYHERE_CONFIG.merchantSecret
    );

    // Prepare PayHere payload
    const paymentPayload: PayHerePaymentPayload = {
      merchant_id: PAYHERE_CONFIG.merchantId,
      return_url: process.env.NEXT_PUBLIC_PAYHERE_RETURN_URL!,
      cancel_url: process.env.NEXT_PUBLIC_PAYHERE_CANCEL_URL!,
      notify_url: process.env.NEXT_PUBLIC_PAYHERE_NOTIFY_URL!,
      order_id: order.orderNumber,
      items: itemsDescription,
      currency: PAYHERE_CONFIG.currency,
      amount: order.total.toFixed(2),
      first_name: order.shippingName.split(' ')[0] || 'Customer',
      last_name: order.shippingName.split(' ').slice(1).join(' ') || '',
      email: session.user.email!,
      phone: order.shippingPhone,
      address: order.shippingAddress,
      city: order.shippingCity,
      country: 'Sri Lanka',
      delivery_address: order.shippingAddress,
      delivery_city: order.shippingCity,
      delivery_country: 'Sri Lanka',
      hash: hash,
      custom_1: session.user.id, // Store user ID
      custom_2: order.id, // Store order ID
    };

    return NextResponse.json({
      success: true,
      paymentUrl: PAYHERE_CONFIG.mode === 'sandbox'
        ? PAYHERE_CONFIG.sandboxUrl
        : PAYHERE_CONFIG.liveUrl,
      payload: paymentPayload,
    });
  } catch (error) {
    console.error('PayHere initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
