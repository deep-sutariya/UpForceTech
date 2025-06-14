import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  await connectDB();
  const { name, email, mobile, password, role } = await req.json();
  const existingUser = await User.findOne({ email });
  if (existingUser) return NextResponse.json({ error: "User already exists" }, { status: 400 });

  const hash = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, mobile, password: hash, role });
  return NextResponse.json({ success: true });
}