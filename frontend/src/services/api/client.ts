/**
 * Centralized API Client Configuration for 3G MeLife Frontend
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export const ACCESS_TOKEN_KEY = "melife_access_token";

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // Retrieve stored Bearer JWT token if in browser environment
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(ACCESS_TOKEN_KEY)
      : null;

  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    credentials: "include", // Essential for HTTP-only session cookies & CORS
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    // If unauthorized, clean stale tokens in browser
    if (response.status === 401 && typeof window !== "undefined") {
      // Do not clear immediately if it was just /auth/me background check
      if (endpoint !== "/auth/me" && endpoint !== "auth/me") {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}
