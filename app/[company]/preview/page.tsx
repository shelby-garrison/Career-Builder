import { connectToDatabase } from "@lib/db";
// import { Company } from "@models/Company";
import CareersHeader from "@components/CareersHeader";
import JobFilters from "@components/JobFilters";
import JobList from "@components/JobList";
import SEO from "@components/SEO";
// import { Company } from '@models/Company';
import { Model } from 'mongoose';
import companySchema, { ICompany } from '@models/Company'; // Adjust the import path
const Company = companySchema as Model<ICompany>;
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function PreviewPage({ params, searchParams }: { params: { company: string }, searchParams: Record<string, string | string[] | undefined> }) {
  await connectToDatabase();
  // Use a timestamp query param to break all caches when navigating from edit
  const _ = searchParams.ts; // intentionally unused; presence busts caches
  const company = await Company.findOne({ slug: params.company }).lean();
  if (!company) {
    return <div className="panel">Company not found</div>;
  }
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const location = typeof searchParams.location === "string" ? searchParams.location : undefined;
  const type = typeof searchParams.type === "string" ? searchParams.type : undefined;

  return (
    <>
      <SEO
        title={`${company.name} Careers (Preview)`}
        description={`Explore roles at ${company.name}`}
        canonical={`/${company.slug}/preview`}
        noindex
      />
      <div className="grid" style={{
        // Remap theme → CSS vars for this page
        // Buttons use var(--primary) → set it to Accent
        ['--primary' as any]: company.theme?.accent || undefined,
        // Keep accent var also set (for any accents that use it directly)
        ['--accent' as any]: company.theme?.accent || undefined,
        // Page background as Primary
        background: company.theme?.primary || undefined,
        // Text color across sections as TextOnPrimary
        color: company.theme?.textOnPrimary || undefined
      }}>
        <CareersHeader company={company} preview />
        <div className="panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="row" style={{ gap: 8 }}>
            <span className="badge">Preview Mode</span>
          </div>
          <a className="button secondary" href={`/${company.slug}/edit`}>
            Back to Edit
          </a>
        </div>
        
        {/* Custom Sections */}
        {company.sections && company.sections.length > 0 && (
          <div className="grid">
            {company.sections.map((section: any) => (
              <div key={section.id} className="panel" style={{ background: "transparent", borderColor: "rgba(255,255,255,0.2)" }}>
                <h2 style={{ textAlign: section.titleAlign || "left" }}>{section.title}</h2>
                <p style={{ color: "inherit", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        )}
        
        <div className="panel">
          <JobFilters companySlug={company.slug} initial={{ q, location, type }} />
        </div>
        <JobList companySlug={company.slug} q={q} location={location} type={type} />
      </div>
    </>
  );
}
