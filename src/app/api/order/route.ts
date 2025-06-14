import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const user = await verifyToken(req);
    let orders;
    if (user.role === "admin") {
      orders = await Order.find({}).sort({ createdAt: -1 });
    }
    else {
      orders = await Order.find({ user: user.id }).sort({ createdAt: -1 });
    }
    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {

    const user = await verifyToken(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { products, address, paymentMethod, deliveryDate, totalAmount } = body;
    console.log(body);


    if (!products || !address || !paymentMethod || !deliveryDate || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newOrder = await Order.create({
      user: user,
      products,
      address,
      paymentMethod,
      deliveryDate,
      totalAmount,
      status: "active",
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}