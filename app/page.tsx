import Link from "next/link";
import SEO from "@components/SEO";

export default function HomePage() {
  return (
    <>
      <SEO
        title="Careers Page Builder - Create Beautiful Career Pages"
        description="Build branded careers pages for your company. Let candidates discover and apply to open roles with ease."
        canonical="/"
      />
      <div className="grid">
        <div className="panel" style={{ textAlign: "center", padding: "48px 24px" }}>
          <h1 style={{ fontSize: "48px", marginBottom: "16px", background: "linear-gradient(135deg, var(--primary), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Careers Page Builder
          </h1>
          <p style={{ fontSize: "20px", color: "var(--muted)", marginBottom: "32px", maxWidth: "600px", margin: "0 auto 32px" }}>
            Create beautiful, branded careers pages that help candidates discover and apply to your open roles. 
            Mobile-friendly, SEO-optimized, and fully customizable.
          </p>
          
          <div className="row" style={{ justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/register" className="button" style={{ fontSize: "18px", padding: "16px 32px" }}>
              Create Your Careers Page
            </Link>
            <Link href="/companies" className="button secondary" style={{ fontSize: "18px", padding: "16px 32px" }}>
              Browse Companies
            </Link>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="panel">
            <h2>For Recruiters</h2>
            <ul style={{ color: "var(--muted)", lineHeight: 1.6 }}>
              <li>Customize your company's brand colors and theme</li>
              <li>Add custom content sections (About Us, Culture, etc.)</li>
              <li>Manage job postings with rich descriptions</li>
              <li>Preview before publishing</li>
              <li>Mobile-optimized for all devices</li>
              <li>SEO-ready with structured data</li>
            </ul>
            <Link href="/register" className="button" style={{ marginTop: "16px" }}>
              Get Started
            </Link>
          </div>

          <div className="panel">
            <h2>For Candidates</h2>
            <ul style={{ color: "var(--muted)", lineHeight: 1.6 }}>
              <li>Discover companies and their culture</li>
              <li>Search and filter job opportunities</li>
              <li>Mobile-friendly browsing experience</li>
              <li>Easy application process</li>
              <li>Accessible design for all users</li>
              <li>Fast loading and responsive</li>
            </ul>
            <Link href="/companies" className="button secondary" style={{ marginTop: "16px" }}>
              Find Jobs
            </Link>
          </div>
        </div>

        <div className="panel" style={{ textAlign: "center" }}>
          <h2>Ready to Get Started?</h2>
          <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
            Join companies already using our platform to showcase their opportunities
          </p>
          <div className="row" style={{ justifyContent: "center", gap: "16px" }}>
            <Link href="/register" className="button">
              Create Account
            </Link>
            <Link href="/login" className="button secondary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
