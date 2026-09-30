import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "@/components/forms/LoginForm";

import { requireGuest } from "@/lib/auth-guard";

export const Route = createFileRoute("/auth/login")({
  component: Login,
  beforeLoad: async () => {
    await requireGuest();
  },
});

function Login() {
  return (
    <div className="flex justify-center p-8">
      <LoginForm />
    </div>
  );
}