import Image from "next/image";

export default function CareersHeader({ company, preview = false }: { company: any; preview?: boolean }) {
  const theme = company.theme || {};
  const showSolidPrimary = !theme.bannerUrl;
  return (
    <header className="panel" style={{ padding: 0, overflow: "hidden", background: showSolidPrimary ? (theme.primary || "var(--primary)") : undefined }}>
      {theme.bannerUrl ? (
        <div style={{ position: "relative", width: "100%", height: 220 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={theme.bannerUrl} alt={`${company.name} banner`} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
        </div>
      ) : (
        <div style={{ height: 120 }} />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, color: theme.textOnPrimary || undefined }}>
        {theme.logoUrl && (
          <div style={{ width: 56, height: 56, position: "relative" }}>
            <Image src={theme.logoUrl} alt={`${company.name} logo`} fill sizes="56px" style={{ objectFit: "contain" }} />
          </div>
        )}
        <div>
          <h1 style={{ margin: 0 }}>{company.name}</h1>
          <div className="row" style={{ gap: 8 }}>
            <span className="badge" style={{ borderColor: theme.accent || "var(--accent)", color: theme.textOnPrimary || undefined }}>Careers</span>
            {preview && <span className="badge">Preview</span>}
          </div>
        </div>
      </div>

      {/* Sections are rendered in page components; header shows only hero */}
    </header>
  );
}
