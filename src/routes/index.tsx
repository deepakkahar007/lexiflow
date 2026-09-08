import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <Link to="/auth/register">
        <Button>Go To Auth</Button>
      </Link>
    </div>
  );
}
