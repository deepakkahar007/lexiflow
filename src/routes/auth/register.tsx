import RegisterUserForm from "@/components/forms/RegisterUserForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/register")({
  component: Register,
});

function Register() {
  return (
    <div className="flex justify-center p-8">
      <RegisterUserForm />
    </div>
  );
}