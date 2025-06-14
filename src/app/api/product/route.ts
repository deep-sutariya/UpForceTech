import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { verifyAdmin } from "@/lib/middleware/auth";

export async function POST(req: NextRequest) {
  await connectDB();
  const auth = verifyAdmin(req);
  
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const { name, price, description, image, category, stock } = body;

  if (!name || !price) {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }

  const product = await Product.create({ name, price, description, image, category, stock });
  return NextResponse.json(product, { status: 201 });
}

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const min = parseFloat(searchParams.get("min") || "0");
  const max = parseFloat(searchParams.get("max") || "1000000");

  const query: any = { isDeleted: { $ne: true }, price: { $gte: min, $lte: max } };
  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;

  const products = await Product.find(query);
  return NextResponse.json(products);
}