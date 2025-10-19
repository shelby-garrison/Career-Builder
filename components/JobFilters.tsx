"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { JOB_TYPES } from "@utils/constants";

export default function JobFilters({ companySlug, initial }: { companySlug: string; initial: { q?: string; location?: string; type?: string } }) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(initial.q || "");
  const [location, setLocation] = useState(initial.location || "");
  const [type, setType] = useState(initial.type || "");

  useEffect(() => {
    const url = new URL(window.location.href);
    const sp = url.searchParams;
    if (q) sp.set("q", q); else sp.delete("q");
    if (location) sp.set("location", location); else sp.delete("location");
    if (type) sp.set("type", type); else sp.delete("type");
    const next = `${pathname}?${sp.toString()}`;
    const t = setTimeout(() => router.replace(next), 200);
    return () => clearTimeout(t);
  }, [q, location, type, router, pathname]);

  return (
    <form className="grid grid-2" onSubmit={(e) => e.preventDefault()} role="search" aria-label="Filter jobs">
      <div>
        <label htmlFor="job-search">Search Jobs</label>
        <input 
          id="job-search"
          className="input" 
          placeholder="Job title, tags..." 
          value={q} 
          onChange={(e) => setQ(e.target.value)}
          aria-describedby="search-help"
        />
        <div id="search-help" className="sr-only">Search for jobs by title or keywords</div>
      </div>
      <div className="row" style={{ gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="job-location">Location</label>
          <input 
            id="job-location"
            className="input" 
            placeholder="e.g., Remote, London" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
            aria-describedby="location-help"
          />
          <div id="location-help" className="sr-only">Filter jobs by location</div>
        </div>
        <div style={{ width: 220, minWidth: 180 }}>
          <label htmlFor="job-type">Job Type</label>
          <select 
            id="job-type"
            className="select" 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            aria-describedby="type-help"
          >
            <option value="">Any Type</option>
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <div id="type-help" className="sr-only">Filter jobs by employment type</div>
        </div>
      </div>
    </form>
  );
}
