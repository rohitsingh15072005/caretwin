export type RecordType =
  | "Laboratory"
  | "Cardiology"
  | "Radiology"
  | "Prescription"
  | "Consultation"
  | "Vaccination"
  | "Other";

export type MetricFlag = "normal" | "watch" | "abnormal";

export interface Metric {
  label: string;
  value: string;
  flag: MetricFlag;
}

export interface MedicalRecord {
  id: string;
  memberId: string;
  type: RecordType;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  doctor: string;
  analysis?: string;
  metrics?: Metric[];
  followUp?: boolean;
  fileName?: string;
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

export interface Prefs {
  shareWithAI: boolean;
  analytics: boolean;
  twoFactor: boolean;
  notifyFollowUps: boolean;
  notifyReports: boolean;
  notifyProduct: boolean;
  notifyEmail: boolean;
}
