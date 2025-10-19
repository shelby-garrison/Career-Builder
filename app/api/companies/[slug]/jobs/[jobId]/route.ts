import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@lib/db";
import { getAuthFromCookies } from "@lib/auth";
import Job from '@models/Job';

export async function PUT(req: NextRequest, { params }: { params: { slug: string; jobId: string } }) {
  await connectToDatabase();
  const auth = getAuthFromCookies();
  if (!auth || auth.companySlug !== params.slug) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, department, location, type, description, applyUrl, remote, tags } = body;

    if (!title?.trim() || !location?.trim()) {
      return NextResponse.json({ error: "Title and location are required" }, { status: 400 });
    }

    const job = await (Job as any).findOneAndUpdate(
      { _id: params.jobId, companySlug: params.slug },
      {
        $set: {
          title: title.trim(),
          department: department?.trim() || undefined,
          location: location.trim(),
          type: type || "Full-time",
          description: description?.trim() || undefined,
          applyUrl: applyUrl?.trim() || undefined,
          remote: Boolean(remote),
          tags: Array.isArray(tags) ? tags : []
        }
      },
      { new: true }
    );

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string; jobId: string } }) {
  await connectToDatabase();
  const auth = getAuthFromCookies();
  if (!auth || auth.companySlug !== params.slug) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await (Job as any).deleteOne({ _id: params.jobId, companySlug: params.slug });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
