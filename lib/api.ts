// CareTwin API Client for connecting Next.js Frontend to FastAPI Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("caretwin_token");
  }
  return null;
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("caretwin_token", token);
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("caretwin_token");
    window.location.href = "/login";
  }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "An error occurred" }));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    return response.json();
  } catch (err: any) {
    if (err.name === "TypeError" && err.message === "Failed to fetch") {
      throw new Error("Cannot connect to CareTwin Backend server. Please make sure uvicorn is running on http://localhost:8000");
    }
    throw err;
  }
}

// ----------------------------------------------------
// 🔑 Auth APIs
// ----------------------------------------------------

export async function loginUser(email: string, password: string): Promise<{ access_token: string }> {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const data = await apiFetch<{ access_token: string }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  setAuthToken(data.access_token);
  return data;
}

export async function registerUser(fullName: string, email: string, password: string, phone?: string) {
  return apiFetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: fullName,
      email,
      password,
      phone,
    }),
  });
}

export async function getCurrentUser() {
  return apiFetch<{ id: number; full_name: string; email: string; phone?: string }>("/auth/me");
}

// ----------------------------------------------------
// 👨‍👩‍👧‍👦 Family Profile APIs
// ----------------------------------------------------

export interface FamilyMember {
  id: number;
  user_id: number;
  name: string;
  relationship: string;
  gender?: string;
  dob?: string;
  blood_group?: string;
  created_at: string;
}

export async function getFamilyMembers(): Promise<FamilyMember[]> {
  return apiFetch<FamilyMember[]>("/family");
}

export async function createFamilyMember(memberData: {
  name: string;
  relationship: string;
  gender?: string;
  dob?: string;
  blood_group?: string;
}): Promise<FamilyMember> {
  return apiFetch<FamilyMember>("/family", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(memberData),
  });
}

// ----------------------------------------------------
// 📁 Smart Record Locker APIs
// ----------------------------------------------------

export interface MedicalRecord {
  id: number;
  family_member_id: number;
  title: string;
  document_type: string;
  file_path: string;
  upload_date: string;
  ocr_status: string;
}

export async function uploadMedicalRecord(
  familyMemberId: number,
  title: string,
  documentType: string,
  file: File
): Promise<MedicalRecord> {
  const formData = new FormData();
  formData.append("family_member_id", familyMemberId.toString());
  formData.append("title", title);
  formData.append("document_type", documentType);
  formData.append("file", file);

  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/records/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Upload failed");
  }

  return response.json();
}

export async function getMedicalRecords(familyMemberId?: number): Promise<MedicalRecord[]> {
  const query = familyMemberId ? `?family_member_id=${familyMemberId}` : "";
  return apiFetch<MedicalRecord[]>(`/records${query}`);
}

export async function deleteMedicalRecord(recordId: number): Promise<void> {
  await apiFetch(`/records/${recordId}`, {
    method: "DELETE",
  });
}

export async function downloadMedicalRecord(recordId: number, filename?: string) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/records/${recordId}/download`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to download file");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `medical_record_${recordId}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function viewMedicalRecord(recordId: number) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/records/${recordId}/download`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to open document");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  window.open(url, "_blank");
}


// ----------------------------------------------------
// 🔬 OCR & Medical NLP APIs
// ----------------------------------------------------

export async function processRecordOCR(recordId: number, rawTextInput?: string) {
  return apiFetch(`/ocr/process/${recordId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ raw_text_input: rawTextInput }),
  });
}

// ----------------------------------------------------
// 📈 Health Timeline & Dashboard Analytics APIs
// ----------------------------------------------------

export interface Measurement {
  id: number;
  family_member_id: number;
  record_id?: number;
  metric_type: string;
  value_numeric: number;
  unit: string;
  recorded_date: string;
}

export async function getHealthTimeline(familyMemberId: number, metricType?: string): Promise<Measurement[]> {
  const query = metricType ? `?metric_type=${metricType}` : "";
  return apiFetch<Measurement[]>(`/timeline/${familyMemberId}${query}`);
}

export async function getTimelineSummary(familyMemberId: number) {
  return apiFetch<{
    family_member_id: number;
    patient_name: string;
    metrics_summary: Array<{
      metric_type: string;
      unit: string;
      latest: number;
      latest_date: string;
      min: number;
      max: number;
      avg: number;
      count: number;
    }>;
  }>(`/timeline/${familyMemberId}/summary`);
}

// ----------------------------------------------------
// 🤖 Trend Risk Flags & Doctor Access APIs
// ----------------------------------------------------

export interface TrendAlert {
  id: number;
  family_member_id: number;
  metric_type: string;
  risk_level: string;
  message: string;
  flagged_date: string;
  is_acknowledged: boolean;
}

export async function evaluateTrends(familyMemberId: number): Promise<TrendAlert[]> {
  return apiFetch<TrendAlert[]>(`/trends/evaluate/${familyMemberId}`, { method: "POST" });
}

export async function getTrendAlerts(familyMemberId: number): Promise<TrendAlert[]> {
  return apiFetch<TrendAlert[]>(`/trends/alerts/${familyMemberId}`);
}

export async function generateDoctorShare(familyMemberId: number, durationHours: number = 24) {
  return apiFetch(`/share/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ family_member_id: familyMemberId, duration_hours: durationHours }),
  });
}
