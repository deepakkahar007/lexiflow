import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notebook")({
  component: NotebookLayout,
});

function NotebookLayout() {
  return <Outlet />;
}
