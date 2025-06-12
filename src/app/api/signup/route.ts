
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import User from "@/models/userModel";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
    console.log("🚀 Received signup POST request");
  await connectDB();
  console.log("Connected to MongoDB");

  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  return NextResponse.json({ message: "User registered successfully", user: newUser });
}
