import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
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
import { getUser, userLogin } from "@/api/query";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useNavigate } from "@tanstack/react-router";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const redirectAfterLogin = useAuthStore((state) => state.redirectAfterLogin);
  const setRedirectAfterLogin = useAuthStore(
    (state) => state.setRedirectAfterLogin,
  );

  const loginMutation = useMutation({
    mutationKey: ["login-user"],
    mutationFn: async (params: { email: string; password: string }) =>
      await userLogin(params.email, params.password),
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

      if (!response.status) {
        form.setFieldMeta("email", (prev) => ({
          ...prev,
          errorMap: { ...prev.errorMap, onSubmit: response.message },
        }));
        return;
      }

      // Login sets the cookie but returns no user payload, so read it back from
      // /auth/me. That also stores it in localStorage for quick lookup.
      try {
        const user = await getUser();
        setUser(user);
      } catch {
        toast.error("Signed in, but could not load your profile. Try again.");
        return;
      }

      // Consume the saved target so a later sign-in does not reuse it.
      const target = redirectAfterLogin ?? "/notebook";
      setRedirectAfterLogin(null);

      await navigate({ to: target });
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
