import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@lib/db";
// import { Company } from "@models/Company";
import { getAuthFromCookies } from "@lib/auth";
import { isValidHex, isValidUrl, nonEmpty } from "@utils/validation";
import { Model } from 'mongoose';
import companySchema, { ICompany } from '@models/Company'; // Adjust the import path
const Company = companySchema as Model<ICompany>;

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  await connectToDatabase();
  const company = await Company.findOne({ slug: params.slug });
  if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(company);
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  await connectToDatabase();
  const auth = getAuthFromCookies();
  if (!auth || auth.companySlug !== params.slug) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { name, theme, sections, published } = body;

  if (!nonEmpty(name)) return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  if (theme) {
    const { primary, accent, textOnPrimary, logoUrl, bannerUrl, videoUrl } = theme;
    if (!isValidHex(primary) || !isValidHex(accent) || !isValidHex(textOnPrimary)) {
      return NextResponse.json({ error: "Invalid colors" }, { status: 400 });
    }
    if (![logoUrl, bannerUrl, videoUrl].every(isValidUrl)) {
      return NextResponse.json({ error: "Invalid URLs" }, { status: 400 });
    }
  }
  if (!Array.isArray(sections)) {
    return NextResponse.json({ error: "Invalid sections" }, { status: 400 });
  }

  const company = await Company.findOneAndUpdate(
    { slug: params.slug },
    { $set: { name, theme, sections, published: !!published } },
    { new: true, upsert: true }
  );

  return NextResponse.json(company);
}
