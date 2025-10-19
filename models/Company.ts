import mongoose, { Schema, models, model } from "mongoose";

type Section = {
  id: string;
  title: string;
  body: string;
  titleAlign?: "left" | "center" | "right";
};

export interface ICompany extends mongoose.Document {
  slug: string;
  name: string;
  theme: {
    primary: string;
    accent: string;
    textOnPrimary: string;
    logoUrl?: string;
    bannerUrl?: string;
    videoUrl?: string;
  };
  sections: Section[];
  published: boolean;
}

const sectionSchema = new Schema<Section>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    titleAlign: { type: String, enum: ["left", "center", "right"], default: "left" }
  },
  { _id: false }
);

const companySchema = new Schema<ICompany>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    theme: {
      primary: { type: String, default: "#0ea5e9" },
      accent: { type: String, default: "#f59e0b" },
      textOnPrimary: { type: String, default: "#ffffff" },
      logoUrl: { type: String },
      bannerUrl: { type: String },
      videoUrl: { type: String }
    },
    sections: { type: [sectionSchema], default: [] },
    published: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Company = models.Company || model<ICompany>("Company", companySchema);
export default Company;
