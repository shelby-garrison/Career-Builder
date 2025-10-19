import { connectToDatabase } from "@lib/db";

async function fetchJobs(slug: string, q?: string, location?: string, type?: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (location) params.set("location", location);
  if (type) params.set("type", type);
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const res = await fetch(`${base}/api/companies/${slug}/jobs?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) return [] as any[];
  return res.json();
}

export default async function JobList({ companySlug, q, location, type }: { companySlug: string; q?: string; location?: string; type?: string }) {
  await connectToDatabase();
  const jobs: any[] = await fetchJobs(companySlug, q, location, type);

  if (!jobs.length) {
    return <div className="panel">No jobs found. Try adjusting filters.</div>;
  }

  return (
    <div className="grid" role="list" aria-label="Job listings">
      {jobs.map((job: any) => (
        <article key={job._id} className="panel" role="listitem">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <h3 style={{ marginBottom: 4 }}>{job.title}</h3>
              <div className="row" style={{ gap: 8 }} role="list" aria-label="Job details">
                <span className="badge" role="text" aria-label={`Location: ${job.location}`}>
                  {job.location}
                </span>
                <span className="badge" role="text" aria-label={`Job type: ${job.type}`}>
                  {job.type}
                </span>
                {job.remote && (
                  <span className="badge" role="text" aria-label="Remote work available">
                    Remote
                  </span>
                )}
                {Array.isArray(job.tags) && job.tags.map((t: string) => (
                  <span key={t} className="badge" role="text" aria-label={`Tag: ${t}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            {job.applyUrl && (
              <a 
                href={job.applyUrl} 
                target="_blank" 
                className="button" 
                rel="noreferrer noopener"
                aria-label={`Apply for ${job.title} position`}
              >
                Apply
              </a>
            )}
          </div>
          {job.description && (
            <p style={{ color: "var(--muted)", marginTop: 8 }}>{job.description}</p>
          )}
        </article>
      ))}
    </div>
  );
}
