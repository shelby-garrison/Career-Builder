import mongoose, { Schema, models, model } from "mongoose";

export interface IJob extends mongoose.Document {
  companySlug: string;
  title: string;
  department?: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship" | "Temporary" | "Other";
  description?: string;
  applyUrl?: string;
  remote?: boolean;
  tags?: string[];
}

const jobSchema = new Schema<IJob>(
  {
    companySlug: { type: String, required: true, index: true },
    title: { type: String, required: true, index: "text" },
    department: { type: String },
    location: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Temporary", "Other"],
      default: "Full-time",
      index: true
    },
    description: { type: String },
    applyUrl: { type: String },
    remote: { type: Boolean, default: false },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", department: "text", location: "text", tags: "text" });

export const Job = models.Job || model<IJob>("Job", jobSchema);
export default Job;
