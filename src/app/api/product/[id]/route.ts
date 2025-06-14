import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { verifyAdmin } from "@/lib/middleware/auth";

export async function PUT(req: NextRequest) {
  const {pathname} = new URL(req.url);
  const id = pathname.split("/")[3];
  
  await connectDB();
  const auth = verifyAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const updated = await Product.findByIdAndUpdate(id, body, { new: true });

  if (!updated) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const {pathname} = new URL(req.url);
  const id = pathname.split("/")[3];
  await connectDB();
  const auth = verifyAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const deleted = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

  if (!deleted) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ success: true, message: "Product soft-deleted" });
}
