import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginResponse = {
  status?: string;
  token?: string;
  [key: string]: unknown;
};

async function loginUser(values: LoginFormValues): Promise<LoginResponse> {
  const response = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    let message = `Login failed with status ${response.status}.`;

    try {
      const error = await response.json();

      if (typeof error?.detail === "string") {
        message = error.detail;
      } else if (typeof error?.message === "string") {
        message = error.message;
      }
    } catch {
      // Keep the default HTTP error message when the response isn't JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

const LoginForm = () => {
  const loginMutation = useMutation({
    mutationKey: ["login-user"],
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies LoginFormValues,
    onSubmit: async ({ value }) => {
      const result = loginSchema.safeParse(value);

      if (!result.success) {
        return;
      }

      const response = await loginMutation.mutateAsync(result.data);
      console.log("response ", response);
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>
          Enter your credentials to log in.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = loginSchema.shape.email.safeParse(value);

                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
              onSubmit: ({ value }) => {
                const result = loginSchema.shape.email.safeParse(value);

                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>

                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="john@example.com"
                  disabled={loginMutation.isPending}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                const result = loginSchema.shape.password.safeParse(value);

                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
              onSubmit: ({ value }) => {
                const result = loginSchema.shape.password.safeParse(value);

                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>

                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="••••••••"
                  disabled={loginMutation.isPending}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Log in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;