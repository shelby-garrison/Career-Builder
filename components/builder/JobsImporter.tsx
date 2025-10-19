"use client";

import { useEffect, useState } from "react";
import Button from "@components/ui/Button";
import Modal from "@components/ui/Modal";
import TextArea from "@components/ui/TextArea";

export default function JobsImporter({ onImport, companySlug }: { onImport: (jobs: any[]) => Promise<void>; companySlug: string }) {
  const [open, setOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/utils/sample-jobs.json").then(r => r.ok ? r.text() : "[]").then(setJsonText).catch(() => {});
  }, []);

  async function importNow() {
    try {
      setLoading(true);
      const parsed = JSON.parse(jsonText);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      await onImport(arr);
      setOpen(false);
    } catch (e: any) {
      alert("Invalid JSON");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "var(--muted)", margin: 0 }}>Import jobs in JSON format.</p>
          <p style={{ color: "var(--muted)", margin: 0 }}>Public API: <span className="kbd">/api/companies/{companySlug}/jobs</span></p>
        </div>
        <Button onClick={() => setOpen(true)}>Import Jobs</Button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h3>Import Jobs (JSON)</h3>
        <p style={{ color: "var(--muted)" }}>Paste an array of job objects. Sample is prefilled.</p>
        <TextArea rows={12} value={jsonText} onChange={(e) => setJsonText(e.target.value)} />
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={importNow} disabled={loading}>{loading ? "Importing..." : "Import"}</Button>
        </div>
      </Modal>
    </>
  );
}
