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
import { userLogin } from "@/api/query";
import { Link, useNavigate } from "@tanstack/react-router";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationKey: ["login-user"],
    mutationFn: async (params: { email: string; password: string }) =>
      await userLogin(params.email, params.password),
    onSuccess: (data) => {
      console.log("mutate success", data);
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

      const response = await loginMutation.mutateAsync({
        email: result.data.email,
        password: result.data.password,
      });

      if (response.status) {
        navigate({
          to: "/notebook",
        });
      }
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>Enter your credentials to log in.</CardDescription>
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

        <hr />

        <Link to="/auth/register">
          <Button>Register</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
