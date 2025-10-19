import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const TOKEN_NAME = "token";

export type AuthPayload = { userId: string; companySlug: string; email: string };

export function signToken(payload: AuthPayload): string {
  const secret = process.env.JWT_SECRET || "fallback-secret-for-development-only";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const secret = process.env.JWT_SECRET || "fallback-secret-for-development-only";
    return jwt.verify(token, secret) as AuthPayload;
  } catch {
    return null;
  }
}

export function getAuthFromCookies(): AuthPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export const setAuthCookie = (token: string) => {
  cookies().set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
};

export const clearAuthCookie = () => {
  cookies().set({
    name: TOKEN_NAME,
    value: "",
    path: "/",
    maxAge: 0
  });
};
