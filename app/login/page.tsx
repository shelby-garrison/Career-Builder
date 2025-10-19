"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("recruiter@acme.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push(`/${data.companySlug}/edit`);
    } catch (error: any) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Recruiter Login</h1>
      <p className="badge">Demo creds auto-provisioned</p>
      <form className="grid" onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {err && <div className="badge" style={{ background: "#3f1d1d", color: "#fda4af" }}>{err}</div>}
        <button className="button" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>
          Tip: Try <span className="kbd">recruiter@acme.com</span> / <span className="kbd">password</span>
        </p>
        
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "var(--primary)" }}>
              Create one
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
