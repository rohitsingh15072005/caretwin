export type RecordType =
  | "Laboratory"
  | "Prescription"
  | "Radiology"
  | "Discharge summary"
  | "Vaccination"
  | "Insurance"
  | "Other";

export interface MedicalRecord {
  id: string;
  memberId: string;
  type: RecordType;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  doctor: string;
  hospital?: string;
  createdAt?: string;
  fileName?: string;
  hasFile?: boolean;
  ocrStatus?: "queued" | "processing" | "succeeded" | "failed";
  ocrText?: string;
  ocrError?: string;
  ocrConfidence?: number | null;
  ocrNeedsReview?: boolean;
  ocrFlags?: string[];
  ocrQuality?: "low" | "medium" | "high" | "unscored";
}

export interface Contact {
  name: string;
  phone: string;
  relation: string;
}

export interface Member {
  id: string;
  name: string;
  relation: string;
  isSelf?: boolean;
  dob: string; // ISO or ""
  gender: string;
  bloodGroup: string;
  heightCm: string;
  weightKg: string;
  allergies: string[];
  conditions: string[];
  medications: string[];
  primaryDoctor: string;
  insurance: string;
  organDonor: boolean;
  contacts: Contact[];
  color: string;
}

export interface Account {
  email: string;
  phone: string;
  avatar: string; // data URL or ""
}
