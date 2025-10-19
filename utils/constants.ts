export const DEFAULT_SECTIONS = [
  { id: "about", title: "About Us", body: "We’re building the future. Join us." },
  { id: "life", title: "Life at Company", body: "Collaborative, caring, and high-performing." }
];

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
  "Other"
] as const;

export type JobType = typeof JOB_TYPES[number];
