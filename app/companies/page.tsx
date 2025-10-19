import { connectToDatabase } from "@lib/db";
// import { Company } from '@models/Company';
import Link from "next/link";
import SEO from "@components/SEO";
import { Model } from 'mongoose';
import companySchema, { ICompany } from '@models/Company'; // Adjust the import path
const Company = companySchema as Model<ICompany>;
export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  await connectToDatabase();
  const companies = await Company.find({ published: true }).select('slug name theme').lean();

  return (
    <>
      <SEO
        title="Companies - Careers Page Builder"
        description="Discover companies and explore their career opportunities"
        canonical="/companies"
      />
      <div className="grid">
        <div className="panel">
          <h1>Discover Companies</h1>
          <p style={{ color: "var(--muted)", marginBottom: 0 }}>
            Explore career opportunities at companies using our platform
          </p>
        </div>

        {companies.length === 0 ? (
          <div className="panel">
            <p style={{ color: "var(--muted)", textAlign: "center" }}>
              No companies have published their careers pages yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-2">
            {companies.map((company: any) => (
              <Link key={company._id} href={`/${company.slug}/careers`} className="panel" style={{ textDecoration: 'none' }}>
                <div style={{ 
                  background: company.theme?.primary || 'var(--primary)', 
                  color: company.theme?.textOnPrimary || 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ margin: 0, color: 'inherit' }}>{company.name}</h3>
                </div>
                <p style={{ color: "var(--muted)", margin: 0, textAlign: "center" }}>
                  View Careers Page →
                </p>
              </Link>
            ))}
          </div>
        )}

        <div className="panel">
          <div className="row" style={{ justifyContent: "center", gap: 16 }}>
            <Link href="/login" className="button">
              Recruiter Login
            </Link>
            <Link href="/register" className="button secondary">
              Create Company
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
