import mongoose, { Schema, models, model } from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  passwordHash: string;
  companySlug: string;
  role: 'recruiter' | 'candidate';
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    resumeUrl?: string;
  };
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    companySlug: { type: String, required: true },
    role: { type: String, enum: ['recruiter', 'candidate'], default: 'recruiter' },
    profile: {
      firstName: { type: String },
      lastName: { type: String },
      phone: { type: String },
      resumeUrl: { type: String }
    }
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", userSchema);
export default User;
