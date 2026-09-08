import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/notebook")({
  component: RouteComponent,
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
