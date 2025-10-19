import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@lib/auth";

export async function GET() {
  const auth = getAuthFromCookies();
  if (!auth) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, ...auth });
}
