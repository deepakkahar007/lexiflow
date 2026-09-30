import RegisterUserForm from "@/components/forms/RegisterUserForm";
import { createFileRoute } from "@tanstack/react-router";

import { requireGuest } from "@/lib/auth-guard";

export const Route = createFileRoute("/auth/register")({
  component: Register,
  beforeLoad: async () => {
    await requireGuest();
  },
});

function Register() {
  return (
    <div className="flex justify-center p-8">
      <RegisterUserForm />
    </div>
  );
}