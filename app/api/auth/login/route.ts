import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@lib/db";
// import { User } from "@models/User";
// import { Company } from "@models/Company";
import { signToken } from "@lib/auth";
import crypto from "crypto";
import { DEFAULT_SECTIONS } from "@utils/constants";
import { Model } from 'mongoose';
import userSchema, { IUser } from '@models/User'; // Adjust the import path
const User = userSchema as Model<IUser>;
import companySchema, { ICompany } from '@models/Company'; // Adjust the import path
const Company = companySchema as Model<ICompany>;

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email, password } = await req.json();

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // bootstrap a default user/company if missing (for demo)
  const defaultEmail = "recruiter@acme.com";
  const defaultCompanySlug = "acme";
  const defaultCompanyName = "Acme Inc.";
  if (email === defaultEmail) {
    const existingCompany = await Company.findOne({ slug: defaultCompanySlug });
    if (!existingCompany) {
      await Company.create({
        slug: defaultCompanySlug,
        name: defaultCompanyName,
        sections: DEFAULT_SECTIONS
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      await User.create({
        email,
        passwordHash: hashPassword("password"),
        companySlug: defaultCompanySlug
      });
    }
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }
  if (user.passwordHash !== hashPassword(password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken({ userId: user._id?.toString() || "", companySlug: user.companySlug, email: user.email });
  const res = NextResponse.json({ ok: true, companySlug: user.companySlug });
  // Set auth cookie on the response to persist for subsequent requests
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
}
