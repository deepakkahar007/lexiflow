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
      {/* The notebook id comes from the route, not from a session lookup: it is
          the notebook being viewed, which is not derivable from the user. */}
      <LeftSideView notebookId={id} />

      <div>{id}</div>

      <RightSideView notebookId={id} />
    </div>
  );
}