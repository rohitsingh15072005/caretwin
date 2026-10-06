import type { RecordType } from "./types";

export const RECORD_TYPES: RecordType[] = [
  "Laboratory",
  "Prescription",
  "Radiology",
  "Discharge summary",
  "Vaccination",
  "Insurance",
  "Other",
];

export const RECORD_TYPE_TO_API: Record<RecordType, string> = {
  Laboratory: "lab_report",
  Prescription: "prescription",
  Radiology: "imaging",
  "Discharge summary": "discharge_summary",
  Vaccination: "vaccination",
  Insurance: "insurance",
  Other: "other",
};

export const API_RECORD_TYPE_TO_LABEL: Record<string, RecordType> = {
  lab_report: "Laboratory",
  prescription: "Prescription",
  imaging: "Radiology",
  discharge_summary: "Discharge summary",
  vaccination: "Vaccination",
  insurance: "Insurance",
  other: "Other",
};

export const RELATIONS = [
  "Self",
  "Mother",
  "Father",
  "Spouse",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Grandmother",
  "Grandfather",
  "Other",
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const MEMBER_COLORS = [
  "#0878b8",
  "#15965d",
  "#7c5cd6",
  "#d9822b",
  "#d6457a",
  "#2a9db0",
];

export const SELF_ID = "self";
