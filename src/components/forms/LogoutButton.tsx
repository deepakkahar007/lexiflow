import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "../ui/button";

const LogoutButton = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  const mutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: async () => {
      // Drop cached data so the next user cannot see the previous one's
      // notebooks from the react-query cache.
      queryClient.clear();
      await navigate({ to: "/auth/login" });
    },
  });

  return (
    <Button
      variant="destructive"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      {mutation.isPending ? "Logging out..." : "Log out"}
    </Button>
  );
};

export default LogoutButton;