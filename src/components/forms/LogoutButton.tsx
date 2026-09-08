import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { userLogout } from "@/api/query";
import { useNavigate } from "@tanstack/react-router";

const LogoutButton = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      navigate({ to: "/" });
    },
  });

  return <Button onClick={() => mutation.mutate()}>Log out</Button>;
};

export default LogoutButton;
