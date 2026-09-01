import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
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

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

type RegisterResponse = {
  status?: string;
  message?: string;
  [key: string]: unknown;
};

async function registerUser(
  values: RegisterFormValues,
): Promise<RegisterResponse> {
  const response = await fetch("http://localhost:8000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    let message = `Registration failed with status ${response.status}.`;

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

const RegisterUserForm = () => {
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationKey: ["register-user"],
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data.message ?? "Registration successful. Please log in.");
      navigate({ to: "/auth/login" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    } satisfies RegisterFormValues,
    onSubmit: async ({ value }) => {
      const result = registerSchema.safeParse(value);

      if (!result.success) {
        return;
      }

      await registerMutation.mutateAsync(result.data);
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Enter your details to register in the application.
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
            name="name"
            validators={{
              onChange: ({ value }) => {
                const result = registerSchema.shape.name.safeParse(value);

                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
              onSubmit: ({ value }) => {
                const result = registerSchema.shape.name.safeParse(value);

                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>

                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="John Doe"
                  disabled={registerMutation.isPending}
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
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = registerSchema.shape.email.safeParse(value);

                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
              onSubmit: ({ value }) => {
                const result = registerSchema.shape.email.safeParse(value);

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
                  disabled={registerMutation.isPending}
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
                const result = registerSchema.shape.password.safeParse(value);

                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
              onSubmit: ({ value }) => {
                const result = registerSchema.shape.password.safeParse(value);

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
                  disabled={registerMutation.isPending}
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
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Registering..." : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterUserForm;
