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
  if (init.body && !headers.has("Content-Type")) {
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
