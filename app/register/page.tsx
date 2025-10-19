"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    userType: "recruiter"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          userType: formData.userType
        }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to company edit page
      router.push(`/${data.companySlug}/edit`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel" style={{ maxWidth: 480, margin: "40px auto" }}>
      <h1>Create Account</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Set up your company's careers page
      </p>

      <form className="grid" onSubmit={onSubmit}>
        <div>
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            className="input"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="companyName">Company Name *</label>
          <input
            id="companyName"
            className="input"
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
            placeholder="Your Company Inc."
          />
          <p style={{ color: "var(--muted)", fontSize: 12, margin: "4px 0 0" }}>
            This will create your careers page at /{formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}/careers
          </p>
        </div>

        <div className="grid grid-2">
          <div>
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              className="input"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              id="confirmPassword"
              className="input"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              placeholder="Repeat password"
            />
          </div>
        </div>

        {error && (
          <div className="badge" style={{ background: "#3f1d1d", color: "#fda4af" }}>
            {error}
          </div>
        )}

        <button className="button" disabled={loading} type="submit">
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--primary)" }}>
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
