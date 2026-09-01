import RegisterUserForm from "@/components/forms/RegisterUserForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <RegisterUserForm />
    </div>
  );
}
