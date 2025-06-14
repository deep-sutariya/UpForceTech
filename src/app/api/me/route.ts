import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/middleware/auth";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const user = await verifyToken(req);
    if(!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
