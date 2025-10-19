"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ThemeForm, { ThemeState } from "@components/builder/ThemeForm";
import SectionsEditor, { SectionState } from "@components/builder/SectionsEditor";
import JobsImporter from "@components/builder/JobsImporter";
import JobManager from "@components/builder/JobManager";

type CompanyData = {
  slug: string;
  name: string;
  theme: ThemeState;
  sections: SectionState[];
  published: boolean;
};

export default function EditPage({ params }: { params: { company: string } }) {
  const slug = params.company;
  const [data, setData] = useState<CompanyData | null>(null);
  const [saving, setSaving] = useState(false);
  const router = require("next/navigation").useRouter();

  async function load() {
    const res = await fetch(`/api/companies/${slug}/settings`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
  }

  useEffect(() => {
    load();
  }, [slug]);

  const canSave = useMemo(() => !!data && data.name.trim().length > 0, [data]);

  async function save() {
    if (!data) return;
    setSaving(true);
    const res = await fetch(`/api/companies/${slug}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setSaving(false);
    if (res.ok) {
      const fresh = await res.json();
      setData(fresh);
      alert("Saved!");
    } else {
      const err = await res.json();
      alert(err.error || "Save failed");
    }
  }

  async function togglePublished(nextValue: boolean) {
    if (!data) return;
    const next = { ...(data as CompanyData), published: nextValue };
    setData(next);
    // Save immediately so public page reflects the change without manual save
    setSaving(true);
    const res = await fetch(`/api/companies/${slug}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next)
    });
    setSaving(false);
    if (res.ok) {
      const fresh = await res.json();
      setData(fresh);
    }
  }

  async function importJobs(jobs: unknown[]) {
    const res = await fetch(`/api/companies/${slug}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobs)
    });
    if (res.ok) {
      alert("Jobs imported");
    } else {
      const err = await res.json();
      alert(err.error || "Import failed");
    }
  }

  if (!data) return <div className="panel">Loading...</div>;

  return (
    <div className="grid">
      <div className="panel">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1>Edit Careers Page</h1>
          <div className="row">
            <button
              className="button secondary"
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                router.push('/login');
              }}
            >
              Logout
            </button>
            <button
              className="button secondary"
              onClick={() => router.push(`/${slug}/preview?ts=${Date.now()}`)}
            >
              Preview
            </button>
            <button className="button" onClick={save} disabled={!canSave || saving}>{saving ? "Saving..." : "Save"}</button>
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <span className="badge">Company slug: {slug}</span>
          <span className="badge">Public link: /{slug}/careers</span>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="panel">
          <h2>Brand Theme</h2>
          <ThemeForm value={data.theme} onChange={(v) => setData({ ...(data as CompanyData), theme: v })} />
        </div>

        <div className="panel">
          <h2>Company Info</h2>
          <div className="grid">
            <div>
              <label>Company Name</label>
              <input className="input" value={data.name} onChange={(e) => setData({ ...(data as CompanyData), name: e.target.value })} />
            </div>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div className="row" style={{ gap: 8 }}>
                <span className="badge">Published</span>
                <input type="checkbox" checked={data.published} onChange={(e) => togglePublished(e.target.checked)} />
              </div>
              <a className="button secondary" href={`/${slug}/careers?ts=${Date.now()}`} target="_blank">Open Public Page</a>
            </div>
          </div>
        </div>

        <div className="panel" style={{ gridColumn: "1 / -1" }}>
          <h2>Content Sections</h2>
          <SectionsEditor value={data.sections} onChange={(v) => setData({ ...(data as CompanyData), sections: v })} />
        </div>

        <div className="panel" style={{ gridColumn: "1 / -1" }}>
          <h2>Jobs</h2>
          <JobsImporter onImport={importJobs} companySlug={slug} />
        </div>

        <div className="panel" style={{ gridColumn: "1 / -1" }}>
          <JobManager companySlug={slug} />
        </div>
      </div>
    </div>
  );
}
