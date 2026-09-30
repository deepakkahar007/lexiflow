import { redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/store/useAuthStore";

/**
 * Wait for the session to be confirmed, revalidating against GET /auth/me when
 * the store is still idle (i.e. on a cold boot).
 */
export async function ensureSession(): Promise<void> {
  const { status, bootstrap } = useAuthStore.getState();

  if (status === "idle") {
    await bootstrap();
  }
}

/**
 * Guard for routes that require a signed-in user.
 *
 * Signed in -> continue. Signed out -> /auth/login, remembering the attempted
 * location so the user lands where they meant to go after signing in.
 */
export async function requireAuth(location: { href: string }) {
  await ensureSession();

  const store = useAuthStore.getState();

  if (!store.user) {
    store.setRedirectAfterLogin(location.href);
    throw redirect({ to: "/auth/login" });
  }
}

/**
 * Guard for routes that only make sense when signed out (login, register).
 * Keeps an already-authenticated user off the sign-in screen.
 */
export async function requireGuest() {
  await ensureSession();

  if (useAuthStore.getState().user) {
    throw redirect({ to: "/notebook" });
  }
}