/**
 * Shape returned by GET /auth/me. Must stay in sync with
 * UserSessionResponse in server/src/routes/Auth.py.
 *
 * `role` is currently always "user": the users table has no role column, so the
 * server returns a constant. RBAC is not wired up yet and no route is gated on
 * role, so treat this field as display-only until a role column exists.
 */
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
};

/** Where the session check currently stands. */
export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated";