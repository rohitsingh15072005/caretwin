"use client";

type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type AuthUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export type CareUser = AuthUser & {
  emailVerifiedAt: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  createdAt: string;
};

export type ApiRecord = {
  id: string;
  title: string;
  recordType: string;
  description: string | null;
  fileName: string | null;
  doctorName: string | null;
  hospitalName: string | null;
  recordDate: string | null;
  createdAt: string;
  updatedAt: string;
  hasFile: boolean;
};

export type DashboardSummary = {
  greeting: { firstName: string | null };
  profile: { percent: number; missing: string[] };
  counts: {
    unreadNotifications: number;
    medicalRecords: number;
    symptomChecks: number;
    openSupportTickets: number;
  };
  recentRecords: Array<{
    id: string;
    title: string;
    recordType: string;
    recordDate: string | null;
    createdAt: string;
  }>;
  recentSymptomChecks: Array<{
    id: string;
    severity: string;
    recommendedSpecialty: string | null;
    createdAt: string;
  }>;
};

export type ApiNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

export type ApiChatSummary = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiChatMessage = {
  id: string;
  sender: "user" | "assistant";
  message: string;
  createdAt: string;
};

export type ApiChat = ApiChatSummary & { messages: ApiChatMessage[] };

export type ApiSymptom = { id: string; label: string };

export type ApiSymptomCheck = {
  id: string;
  symptoms: string[];
  severity: string;
  urgency: string;
  recommendedSpecialty: string | null;
  createdAt: string;
};

type LoginResponse = {
  user: AuthUser;
  accessToken: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let accessToken: string | null = null;
let refreshInFlight: Promise<string | null> | null = null;

async function request<T>(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (typeof init.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers,
      credentials: "same-origin",
    });
  } catch {
    throw new ApiError(
      "Could not connect to the CareTwin API. Check CARETWIN_BACKEND_ORIGIN and that the backend is online.",
      0,
    );
  }

  if (response.status === 204) return undefined as T;

  let payload: ApiSuccess<T> | { error?: { message?: string } };
  try {
    payload = (await response.json()) as
      | ApiSuccess<T>
      | { error?: { message?: string } };
  } catch {
    throw new ApiError(
      `The CareTwin API returned a non-JSON response (HTTP ${response.status}). Check the API proxy configuration.`,
      response.status,
    );
  }

  if (!response.ok) {
    throw new ApiError(
      payload && "error" in payload && payload.error?.message
        ? payload.error.message
        : `The CareTwin API request failed (HTTP ${response.status}).`,
      response.status,
    );
  }

  if (!payload || !("success" in payload) || !payload.success || !("data" in payload)) {
    throw new ApiError("The CareTwin API returned an invalid response.", response.status);
  }

  return payload.data;
}

export async function register(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  return request<{ message: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function verifyEmail(token: string) {
  return request<{ message: string }>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function requestPasswordReset(email: string) {
  return request<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string) {
  return request<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}

export async function login(input: { email: string; password: string }) {
  const result = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  accessToken = result.accessToken;
  return result;
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = request<{ accessToken: string }>("/auth/refresh", {
    method: "POST",
  })
    .then(({ accessToken: refreshedToken }) => {
      accessToken = refreshedToken;
      return refreshedToken;
    })
    .catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 401) {
        accessToken = null;
        return null;
      }
      throw error;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let token = accessToken ?? (await refreshAccessToken());
  if (!token) throw new ApiError("Please sign in to continue.", 401);

  try {
    return await request<T>(path, init, token);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
  }

  accessToken = null;
  token = await refreshAccessToken();
  if (!token) throw new ApiError("Your session has expired. Please sign in again.", 401);
  return request<T>(path, init, token);
}

export async function logout() {
  try {
    await request<void>("/auth/logout", { method: "POST" });
  } finally {
    accessToken = null;
  }
}

export async function getCurrentUser() {
  return apiFetch<{ user: CareUser }>("/users/me");
}

export async function updateCurrentUser(
  input: Partial<Pick<CareUser, "firstName" | "lastName" | "phone" | "dateOfBirth" | "gender">>,
) {
  return apiFetch<{ user: CareUser }>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function listRecords() {
  const items: ApiRecord[] = [];
  let cursor: string | null = null;

  do {
    const query = new URLSearchParams({ limit: "50" });
    if (cursor) query.set("cursor", cursor);
    const page = await apiFetch<{ items: ApiRecord[]; nextCursor: string | null }>(
      `/records?${query.toString()}`,
    );
    items.push(...page.items);
    cursor = page.nextCursor;
  } while (cursor);

  return { items, nextCursor: null };
}

export async function createRecord(
  input: {
    title: string;
    recordType: string;
    description?: string;
    doctorName?: string;
    hospitalName?: string;
    recordDate?: string;
  },
) {
  return apiFetch<{ record: ApiRecord }>("/records", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateRecord(
  id: string,
  input: {
    title?: string;
    recordType?: string;
    description?: string | null;
    doctorName?: string | null;
    hospitalName?: string | null;
    recordDate?: string | null;
  },
) {
  return apiFetch<{ record: ApiRecord }>(`/records/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteRecord(id: string) {
  return apiFetch<void>(`/records/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function uploadRecordFile(id: string, file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiFetch<{ message: string; mime: string }>(`/records/${encodeURIComponent(id)}/file`, {
    method: "POST",
    body,
  });
}

async function requestFile(path: string, token: string) {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "same-origin",
    });
  } catch {
    throw new ApiError(
      "Could not connect to the CareTwin API. Check CARETWIN_BACKEND_ORIGIN and that the backend is online.",
      0,
    );
  }

  if (!response.ok) {
    let message = `The CareTwin API request failed (HTTP ${response.status}).`;
    try {
      const payload = (await response.json()) as { error?: { message?: string } };
      message = payload.error?.message ?? message;
    } catch {
      // Non-JSON error responses still include their HTTP status in the message.
    }
    throw new ApiError(message, response.status);
  }

  return {
    blob: await response.blob(),
    contentDisposition: response.headers.get("Content-Disposition"),
  };
}

export async function downloadRecordFile(id: string) {
  let token = accessToken ?? (await refreshAccessToken());
  if (!token) throw new ApiError("Please sign in to continue.", 401);

  try {
    return await requestFile(`/records/${encodeURIComponent(id)}/file`, token);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
  }

  accessToken = null;
  token = await refreshAccessToken();
  if (!token) throw new ApiError("Your session has expired. Please sign in again.", 401);
  return requestFile(`/records/${encodeURIComponent(id)}/file`, token);
}

export async function getDashboardSummary() {
  return apiFetch<DashboardSummary>("/dashboard");
}

export async function listNotifications() {
  return apiFetch<{ items: ApiNotification[]; nextCursor: string | null }>("/notifications?limit=50");
}

export async function markNotificationRead(id: string) {
  return apiFetch<{ message: string }>(`/notifications/${encodeURIComponent(id)}/read`, {
    method: "PATCH",
  });
}

export async function markAllNotificationsRead() {
  return apiFetch<{ updated: number }>("/notifications/read-all", { method: "POST" });
}

export async function listChats() {
  return apiFetch<{ items: ApiChatSummary[]; nextCursor: string | null }>("/chats?limit=50");
}

export async function createChat(title?: string) {
  return apiFetch<{ chat: ApiChatSummary }>("/chats", {
    method: "POST",
    body: JSON.stringify(title ? { title } : {}),
  });
}

export async function getChat(id: string) {
  return apiFetch<{ chat: ApiChat }>(`/chats/${encodeURIComponent(id)}`);
}

export async function sendChatMessage(id: string, message: string) {
  return apiFetch<{
    userMessage: ApiChatMessage;
    assistantMessage: ApiChatMessage;
    emergency: { id: string; kind: string } | null;
  }>(`/chats/${encodeURIComponent(id)}/messages`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function listSymptomVocabulary() {
  return apiFetch<{ symptoms: ApiSymptom[] }>("/symptoms/vocabulary");
}

export async function createSymptomCheck(input: {
  symptoms: string[];
  severity: "low" | "medium" | "high";
  durationDays: number;
}) {
  return apiFetch<{ result: ApiSymptomCheck }>("/symptoms/check", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function listSymptomHistory() {
  return apiFetch<{ items: ApiSymptomCheck[]; nextCursor: string | null }>("/symptoms/history?limit=50");
}
