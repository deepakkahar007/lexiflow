import LoginForm from "@/components/forms/LoginForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login")({
  component: Login,
});

function Login() {
  return (
    <div className="flex justify-center p-8">
      <LoginForm />
    </div>
  );
}