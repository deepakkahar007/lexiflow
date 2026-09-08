import LeftSideView from "@/components/layout/LeftSideView";
import RightSideView from "@/components/layout/RightSideView";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/notebook")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <LeftSideView />

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <RightSideView />
    </div>
  );
}
