import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@lib/db";
import { signToken } from "@lib/auth";
import crypto from "crypto";
import { Model } from 'mongoose';
import userSchema, { IUser } from '@models/User'; // Adjust the import path
const User = userSchema as Model<IUser>;
import companySchema, { ICompany } from '@models/Company'; // Adjust the import path
const Company = companySchema as Model<ICompany>;
import { DEFAULT_SECTIONS } from "@utils/constants";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email, password, companyName, userType } = await req.json();

  // Validation
  if (!email || !password || !companyName) {
    return NextResponse.json({ error: "Email, password, and company name are required" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  if (!email.includes('@')) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Generate unique company slug
    let companySlug = generateSlug(companyName);
    let counter = 1;
    while (await Company.findOne({ slug: companySlug })) {
      companySlug = `${generateSlug(companyName)}-${counter}`;
      counter++;
    }

    // Create company
    const company = await Company.create({
      slug: companySlug,
      name: companyName,
      sections: DEFAULT_SECTIONS,
      published: false
    });

    // Create user
    const user = await User.create({
      email,
      passwordHash: hashPassword(password),
      companySlug: company.slug
    });

    // Generate token
    const token = signToken({ 
      userId: user._id?.toString() || "", 
      companySlug: user.companySlug, 
      email: user.email 
    });

    const res = NextResponse.json({ 
      ok: true, 
      companySlug: user.companySlug,
      message: "Account created successfully" 
    });

    // Set auth cookie
    res.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return res;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
