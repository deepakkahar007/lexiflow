import LeftSideView from "@/components/layout/LeftSideView";
import RightSideView from "@/components/layout/RightSideView";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notebook/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <div className="flex h-screen">
      <LeftSideView />

      <div>{id}</div>

      <RightSideView />
    </div>
  );
}
