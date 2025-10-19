import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@lib/db";
// import { Job } from "@models/Job";
import { getAuthFromCookies } from "@lib/auth";
import Job from '@models/Job';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const location = searchParams.get("location") || undefined;
  const type = searchParams.get("type") || undefined;

  const filter: Record<string, unknown> = { companySlug: params.slug };
  if (location) filter.location = location;
  if (type) filter.type = type;

  let jobs;
  if (q) {
    jobs = await (Job as any).find({ ...filter, $text: { $search: q } }).sort({ createdAt: -1 }).lean();
  } else {
    jobs = await (Job as any).find(filter).sort({ createdAt: -1 }).lean();
  }
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  await connectToDatabase();
  const auth = getAuthFromCookies();
  if (!auth || auth.companySlug !== params.slug) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await req.json();
  const items = Array.isArray(payload) ? payload : [payload];
  const cleaned = items.map((j) => ({
    companySlug: params.slug,
    title: String(j.title || "").trim(),
    department: j.department ? String(j.department) : undefined,
    location: String(j.location || "Remote"),
    type: ["Full-time", "Part-time", "Contract", "Internship", "Temporary", "Other"].includes(j.type)
      ? j.type
      : "Full-time",
    description: j.description ? String(j.description) : undefined,
    applyUrl: j.applyUrl ? String(j.applyUrl) : undefined,
    remote: Boolean(j.remote),
    tags: Array.isArray(j.tags) ? j.tags.map(String) : []
  })).filter((j) => j.title && j.location);

  if (cleaned.length === 0) return NextResponse.json({ error: "No valid jobs" }, { status: 400 });

  const created = await Job.insertMany(cleaned as any);
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  await connectToDatabase();
  const auth = getAuthFromCookies();
  if (!auth || auth.companySlug !== params.slug) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids required" }, { status: 400 });
  }
  await (Job as any).deleteMany({ _id: { $in: ids }, companySlug: params.slug });
  return NextResponse.json({ ok: true });
}
