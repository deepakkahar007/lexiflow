import { env } from "@/lib/env";

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

/**
 * Invoked when any request comes back 401. The auth store registers this on
 * creation rather than being imported here, which keeps this module free of a
 * store -> client -> store import cycle.
 */
type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | void) {
  onUnauthorized = handler ?? null;
}

/** Pull the most useful message out of the server's error envelope. */
function extractMessage(body: unknown, fallback: string): string {
  if (typeof body === "object" && body !== null) {
    const record = body as Record<string, unknown>;

    for (const key of ["message", "error", "detail"]) {
      const value = record[key];

      if (typeof value === "string" && value.length > 0) {
        return value;
      }
    }
  }

  return fallback;
}

/**
 * Single entry point for talking to the backend.
 *
 * `credentials: "include"` is always sent so the browser attaches the
 * access_token cookie, which is what every protected endpoint validates.
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);

  // Let the browser set the multipart boundary for FormData bodies.
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;

  if (!isFormData && init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${env.VITE_SERVER_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body: unknown = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    if (response.status === 401) {
      onUnauthorized?.();
      throw new ApiError(401, "Your session has expired. Please sign in again.", body);
    }

    throw new ApiError(
      response.status,
      extractMessage(body, `Request failed with status ${response.status}.`),
      body,
    );
  }

  return body as T;
}