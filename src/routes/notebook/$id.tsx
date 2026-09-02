import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notebook/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return <div>Hello "/notebook/$id"! {id}</div>;
}
