import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
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
    const { status } = await req.json();

    // Validate status
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      select: { id: true, userId: true, orderNumber: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: status as 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
        updatedAt: new Date(),
      },
    });

    // Revalidate all pages that display this order
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath('/account/orders');
    revalidatePath(`/orders/${existingOrder.orderNumber}/confirmation`);
    
    // Also revalidate using tags for more flexibility
    revalidateTag('orders');
    revalidateTag(`order-${id}`);

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order status update error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
