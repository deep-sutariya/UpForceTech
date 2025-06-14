import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/middleware/auth';

export async function DELETE(req: NextRequest) {
  try {
    const {pathname} = new URL(req.url);
    const id = pathname.split("/")[3];
    await connectDB();
    const user = await verifyToken(req);
    
    const order = await Order.findOne({ _id: id, user: user.id });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'active') {
      return NextResponse.json({ error: 'Only active orders can be cancelled' }, { status: 400 });
    }

    order.status = 'cancelled';
    await order.save();

    return NextResponse.json({ message: 'Order cancelled successfully' }, { status: 200 });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Cancel failed' }, { status: 500 });
  }
}