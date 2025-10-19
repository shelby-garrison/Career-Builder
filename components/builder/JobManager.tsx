"use client";

import { useEffect, useState } from "react";
import Button from "@components/ui/Button";
import Modal from "@components/ui/Modal";
import TextArea from "@components/ui/TextArea";
import Input from "@components/ui/Input";
import Select from "@components/ui/Select";
import { JOB_TYPES } from "@utils/constants";

type Job = {
  _id: string;
  title: string;
  department?: string;
  location: string;
  type: string;
  description?: string;
  applyUrl?: string;
  remote: boolean;
  tags: string[];
};

type JobFormData = {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  applyUrl: string;
  remote: boolean;
  tags: string;
};

export default function JobManager({ companySlug }: { companySlug: string }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
    applyUrl: "",
    remote: false,
    tags: ""
  });

  async function loadJobs() {
    try {
      const res = await fetch(`/api/companies/${companySlug}/jobs`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, [companySlug]);

  function openModal(job?: Job) {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        department: job.department || "",
        location: job.location,
        type: job.type,
        description: job.description || "",
        applyUrl: job.applyUrl || "",
        remote: job.remote,
        tags: job.tags.join(", ")
      });
    } else {
      setEditingJob(null);
      setFormData({
        title: "",
        department: "",
        location: "",
        type: "Full-time",
        description: "",
        applyUrl: "",
        remote: false,
        tags: ""
      });
    }
    setShowModal(true);
  }

  async function saveJob() {
    try {
      const jobData = {
        ...formData,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
      };

      const url = editingJob 
        ? `/api/companies/${companySlug}/jobs/${editingJob._id}`
        : `/api/companies/${companySlug}/jobs`;
      
      const method = editingJob ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData)
      });

      if (res.ok) {
        await loadJobs();
        setShowModal(false);
        alert(editingJob ? "Job updated!" : "Job created!");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save job");
      }
    } catch (error) {
      alert("Failed to save job");
    }
  }

  async function deleteJob(jobId: string) {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`/api/companies/${companySlug}/jobs/${jobId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        await loadJobs();
        alert("Job deleted!");
      } else {
        alert("Failed to delete job");
      }
    } catch (error) {
      alert("Failed to delete job");
    }
  }

  if (loading) {
    return <div className="panel">Loading jobs...</div>;
  }

  return (
    <div className="grid">
      <div className="panel">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>Manage Jobs ({jobs.length})</h2>
          <Button onClick={() => openModal()}>Add Job</Button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="panel">
          <p style={{ color: "var(--muted)", textAlign: "center" }}>
            No jobs yet. Add your first job to get started.
          </p>
        </div>
      ) : (
        <div className="grid">
          {jobs.map((job) => (
            <div key={job._id} className="panel">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: 8 }}>{job.title}</h3>
                  <div className="row" style={{ gap: 8, marginBottom: 8 }}>
                    <span className="badge">{job.location}</span>
                    <span className="badge">{job.type}</span>
                    {job.remote && <span className="badge">Remote</span>}
                    {job.department && <span className="badge">{job.department}</span>}
                  </div>
                  {job.description && (
                    <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
                      {job.description.length > 100 
                        ? `${job.description.substring(0, 100)}...` 
                        : job.description}
                    </p>
                  )}
                  {job.tags.length > 0 && (
                    <div className="row" style={{ gap: 4, marginTop: 8 }}>
                      {job.tags.map((tag) => (
                        <span key={tag} className="badge" style={{ fontSize: 11 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <Button variant="secondary" onClick={() => openModal(job)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => deleteJob(job._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h3>{editingJob ? "Edit Job" : "Add New Job"}</h3>
        <div className="grid">
          <div>
            <label>Job Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          
          <div className="grid grid-2">
            <div>
              <label>Department</label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Engineering"
              />
            </div>
            <div>
              <label>Location *</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., San Francisco, CA"
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div>
              <label>Job Type *</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </div>
            <div className="row" style={{ alignItems: "end" }}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.remote}
                  onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
                />
                Remote friendly
              </label>
            </div>
          </div>

          <div>
            <label>Description</label>
            <TextArea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Job description, requirements, responsibilities..."
            />
          </div>

          <div>
            <label>Apply URL</label>
            <Input
              type="url"
              value={formData.applyUrl}
              onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
              placeholder="https://company.com/apply"
            />
          </div>

          <div>
            <label>Tags (comma-separated)</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="React, TypeScript, Full-stack"
            />
          </div>
        </div>

        <div className="row" style={{ justifyContent: "flex-end", marginTop: 16 }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            onClick={saveJob} 
            disabled={!formData.title.trim() || !formData.location.trim()}
          >
            {editingJob ? "Update Job" : "Create Job"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
