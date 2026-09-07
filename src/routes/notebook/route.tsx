import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/notebook")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r">
        <h2>My Notebooks</h2>

        {/* notebook links */}
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <aside className="w-64 border-r">
        <h2>My Notebooks</h2>

        {/* notebook links */}
      </aside>
    </div>
  );
}
