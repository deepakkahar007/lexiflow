import { create } from "zustand";
import { persist } from "zustand/middleware";

import { ApiError, setUnauthorizedHandler } from "@/api/client";
import { getUser, userLogout } from "@/api/query";
import type { AuthStatus, SessionUser } from "@/types/auth";

type AuthState = {
  user: SessionUser | null;
  status: AuthStatus;

  /**
   * Where the user was headed when they got bounced to the sign-in screen, so
   * login can return them there. Lives in the store rather than a search param
   * because a validated search param would become required on every navigation
   * to /auth/login.
   */
  redirectAfterLogin: string | null;

  /**
   * Revalidate the session against GET /auth/me.
   *
   * This is the source of truth for whether a user is signed in. The persisted
   * user is only a render cache, so this must run before any guard trusts it.
   * Concurrent callers share a single in-flight request.
   */
  bootstrap: () => Promise<void>;

  /** Adopt a user we already know to be valid (e.g. right after login). */
  setUser: (user: SessionUser) => void;

  /** Remember the path to return to after a successful login. */
  setRedirectAfterLogin: (path: string | null) => void;

  /** Drop local state without calling the server. */
  clearSession: () => void;

  /** Call the logout endpoint, then drop local state. */
  logout: () => Promise<void>;
};

/** Shared across callers so parallel route guards issue one request. */
let inflight: Promise<void> | null = null;

/**
 * Ask the server who we are.
 *
 * Kept separate from bootstrap so the store never calls setState from a module
 * initialiser path, and so a signed-out 401 is treated as an answer rather
 * than an error.
 */
async function fetchSessionUser(): Promise<SessionUser | null> {
  try {
    return await getUser();
  } catch (error) {
    // 401 is the expected answer when nobody is signed in, not a failure.
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }

    // Network failure or a 5xx: treat as signed out rather than trapping the
    // app in a loading state. bootstrap() is cheap and runs again on the next
    // cold boot.
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      status: "idle",
      redirectAfterLogin: null,

      bootstrap: async () => {
        // Once a session has been confirmed, do not re-check on every render.
        if (get().status === "authenticated" || get().status === "unauthenticated") {
          return;
        }

        if (inflight) {
          return inflight;
        }

        set({ status: "loading" });

        inflight = fetchSessionUser()
          .then((user) => {
            set(
              user
                ? { user, status: "authenticated" }
                : { user: null, status: "unauthenticated" },
            );
          })
          .finally(() => {
            inflight = null;
          });

        return inflight;
      },

      setUser: (user) => set({ user, status: "authenticated" }),

      setRedirectAfterLogin: (path) => set({ redirectAfterLogin: path }),

      clearSession: () => set({ user: null, status: "unauthenticated" }),

      logout: async () => {
        try {
          await userLogout();
        } catch {
          // Logout is best effort: the local session is cleared regardless.
        }

        set({
          user: null,
          status: "unauthenticated",
          redirectAfterLogin: null,
        });
      },
    }),
    {
      name: "lexiflow.auth",
      // Only the user is cached. status is deliberately excluded so a stale
      // "authenticated" can never be restored from localStorage and bypass the
      // guard; it always starts at "idle" and must be revalidated.
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

// A 401 from any request means the cookie is gone or rejected, so drop the
// cached user immediately instead of leaving the UI showing a signed-in shell.
setUnauthorizedHandler(() => useAuthStore.getState().clearSession());