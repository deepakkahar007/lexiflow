import { createFileRoute, Outlet } from "@tanstack/react-router";

import { requireAuth } from "@/lib/auth-guard";

export const Route = createFileRoute("/notebook")({
  component: RouteComponent,
  // Guarding the layout parent covers both /notebook and /notebook/$id.
  beforeLoad: async ({ location }) => {
    await requireAuth(location);
  },
});

function RouteComponent() {
  return (
    <div>
      {/* Main content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}