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

export default async function CareersPage({ params, searchParams }: { params: { company: string }, searchParams: Record<string, string | string[] | undefined> }) {
  await connectToDatabase();
  // Timestamp param to ensure fresh fetch when coming from edit/preview
  const _ = searchParams.ts; // noop, for cache-busting
  const company = await Company.findOne({ slug: params.company }).lean();
  if (!company || !company.published) {
    return <div className="panel">This page is not available.</div>;
  }

  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const location = typeof searchParams.location === "string" ? searchParams.location : undefined;
  const type = typeof searchParams.type === "string" ? searchParams.type : undefined;

  return (
    <>
      <SEO
        title={`${company.name} Careers`}
        description={`Explore open roles at ${company.name}`}
        canonical={`/${company.slug}/careers`}
        schemaOrg={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": company.name,
          "url": `https://example.com/${company.slug}/careers`,
          "logo": company.theme?.logoUrl || undefined
        }}
      />
      <div className="grid" style={{
        // Buttons use var(--primary) → set it to Accent
        ['--primary' as any]: company.theme?.accent || undefined,
        ['--accent' as any]: company.theme?.accent || undefined,
        background: company.theme?.primary || undefined,
        color: company.theme?.textOnPrimary || undefined
      }}>
        <CareersHeader company={company} />
        
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
