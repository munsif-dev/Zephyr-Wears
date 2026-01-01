import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generatePayHereHash, PAYHERE_CONFIG } from '@/lib/payhere';

/**
 * PayHere Server-to-Server Notification Handler
 * Called by PayHere when payment status changes
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const merchant_id = formData.get('merchant_id') as string;
    const order_id = formData.get('order_id') as string;
    const payhere_amount = formData.get('payhere_amount') as string;
    const payhere_currency = formData.get('payhere_currency') as string;
    const status_code = formData.get('status_code') as string;
    const md5sig = formData.get('md5sig') as string;
    const payment_id = formData.get('payment_id') as string;
    const method = formData.get('method') as string;
    const custom_1 = formData.get('custom_1') as string; // user ID
    const custom_2 = formData.get('custom_2') as string; // order ID

    // Verify merchant ID
    if (merchant_id !== PAYHERE_CONFIG.merchantId) {
      console.error('Invalid merchant ID');
      return NextResponse.json({ error: 'Invalid merchant' }, { status: 400 });
    }

    // Generate local hash for verification
    const localHash = generatePayHereHash(
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      PAYHERE_CONFIG.merchantSecret
    );

    // Verify hash
    if (localHash !== md5sig) {
      console.error('Hash verification failed');
      return NextResponse.json({ error: 'Invalid hash' }, { status: 400 });
    }

    // Find order
    const order = await prisma.order.findUnique({
      where: { orderNumber: order_id },
    });

    if (!order) {
      console.error('Order not found:', order_id);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Map PayHere status code
    let paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
    let orderStatus: 'PENDING' | 'PROCESSING' | 'CANCELLED';

    switch (status_code) {
      case '2': // Success
        paymentStatus = 'SUCCESS';
        orderStatus = 'PROCESSING';
        break;
      case '0': // Pending
        paymentStatus = 'PENDING';
        orderStatus = 'PENDING';
        break;
      case '-1': // Cancelled
        paymentStatus = 'CANCELLED';
        orderStatus = 'CANCELLED';
        break;
      case '-2': // Failed
        paymentStatus = 'FAILED';
        orderStatus = 'PENDING';
        break;
      case '-3': // Chargedback
        paymentStatus = 'REFUNDED';
        orderStatus = 'CANCELLED';
        break;
      default:
        paymentStatus = 'PENDING';
        orderStatus = 'PENDING';
    }

    // Update order with payment information
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        status: orderStatus,
        paymentId: payment_id,
        paymentMethod: method,
        paymentDate: paymentStatus === 'SUCCESS' ? new Date() : null,
        paymentHash: md5sig,
      },
    });

    console.log(`Order ${order_id} payment status updated to ${paymentStatus}`);

    // TODO: Send email notification to customer
    // TODO: Send email to admin for successful orders

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PayHere notification error:', error);
    return NextResponse.json(
      { error: 'Failed to process notification' },
      { status: 500 }
    );
  }
}

// Allow POST requests without CSRF protection for webhook
export const dynamic = 'force-dynamic';
